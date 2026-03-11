<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateInviteRequest;
use App\Models\Workspace;
use App\Models\WorkspaceInvite;
use App\Models\WorkspaceMember;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class InviteController extends Controller
{
    /**
     * Generate an invite token for a workspace. Only members can invite.
     * POST /workspaces/{id}/invites
     */
    public function store(CreateInviteRequest $request, int $workspaceId): JsonResponse
    {
        $user = $request->user();

        $workspace = Workspace::findOrFail($workspaceId);

        if (! $workspace->hasMember($user->id)) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $invite = WorkspaceInvite::create([
            'workspace_id' => $workspace->id,
            'token'        => Str::random(40),
            'email'        => $request->email,
            'invited_by'   => $user->id,
            'expires_at'   => now()->addDays(7),
        ]);

        $inviteUrl = rtrim(config('app.frontend_url', $request->headers->get('origin', 'http://localhost:5173')), '/')
            . '/invites/accept/' . $invite->token;

        return response()->json([
            'token'      => $invite->token,
            'invite_url' => $inviteUrl,
            'expires_at' => $invite->expires_at,
        ], 201);
    }

    /**
     * Accept an invite by token. Adds the authenticated user to the workspace.
     * POST /invites/accept/{token}
     */
    public function accept(Request $request, string $token): JsonResponse
    {
        $user = $request->user();

        $invite = WorkspaceInvite::where('token', $token)->firstOrFail();

        if ($invite->isAccepted()) {
            return response()->json(['message' => 'Invite has already been used.'], 422);
        }

        if ($invite->isExpired()) {
            return response()->json(['message' => 'Invite has expired.'], 422);
        }

        $workspace = $invite->workspace;

        // Already a member — return workspace info without error
        if ($workspace->hasMember($user->id)) {
            $workspace->load(['owner:id,name,email', 'workspaceMembers.user:id,name,email']);

            return response()->json([
                'message'   => 'You are already a member of this workspace.',
                'workspace' => [
                    'id'   => $workspace->id,
                    'name' => $workspace->name,
                ],
            ]);
        }

        WorkspaceMember::create([
            'workspace_id' => $workspace->id,
            'user_id'      => $user->id,
            'role'         => 'member',
        ]);

        $invite->update(['accepted_at' => now()]);

        return response()->json([
            'message'   => 'You have joined the workspace.',
            'workspace' => [
                'id'   => $workspace->id,
                'name' => $workspace->name,
            ],
        ]);
    }
}
