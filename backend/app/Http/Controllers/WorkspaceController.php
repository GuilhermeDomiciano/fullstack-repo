<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateWorkspaceRequest;
use App\Models\Workspace;
use App\Models\WorkspaceMember;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkspaceController extends Controller
{
    /**
     * List all workspaces the authenticated user belongs to.
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $workspaces = Workspace::whereHas('workspaceMembers', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        })
            ->with(['owner:id,name,email', 'workspaceMembers.user:id,name,email'])
            ->get()
            ->map(fn (Workspace $ws) => $this->formatWorkspace($ws, $userId));

        return response()->json($workspaces);
    }

    /**
     * Create a new workspace. The creator becomes the owner and first member.
     */
    public function store(CreateWorkspaceRequest $request): JsonResponse
    {
        $user = $request->user();

        $workspace = Workspace::create([
            'name'        => $request->name,
            'description' => $request->description,
            'owner_id'    => $user->id,
        ]);

        // Add creator as owner member
        WorkspaceMember::create([
            'workspace_id' => $workspace->id,
            'user_id'      => $user->id,
            'role'         => 'owner',
        ]);

        $workspace->load(['owner:id,name,email', 'workspaceMembers.user:id,name,email']);

        return response()->json($this->formatWorkspace($workspace, $user->id), 201);
    }

    /**
     * Show a single workspace (only members can view).
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $workspace = Workspace::with(['owner:id,name,email', 'workspaceMembers.user:id,name,email'])
            ->findOrFail($id);

        if (! $workspace->hasMember($user->id)) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        return response()->json($this->formatWorkspace($workspace, $user->id));
    }

    /**
     * Remove a member from a workspace. Only the owner can do this.
     */
    public function removeMember(Request $request, int $workspaceId, int $userId): JsonResponse
    {
        $currentUser = $request->user();

        $workspace = Workspace::findOrFail($workspaceId);

        if ($workspace->owner_id !== $currentUser->id) {
            return response()->json(['message' => 'Only the workspace owner can remove members.'], 403);
        }

        if ($userId === $currentUser->id) {
            return response()->json(['message' => 'Owner cannot remove themselves.'], 422);
        }

        $deleted = WorkspaceMember::where('workspace_id', $workspaceId)
            ->where('user_id', $userId)
            ->delete();

        if (! $deleted) {
            return response()->json(['message' => 'Member not found.'], 404);
        }

        return response()->json(null, 204);
    }

    // -------------------------------------------------------------------------

    private function formatWorkspace(Workspace $ws, int $currentUserId): array
    {
        $currentMember = $ws->workspaceMembers->firstWhere('user_id', $currentUserId);

        return [
            'id'          => $ws->id,
            'name'        => $ws->name,
            'description' => $ws->description,
            'owner'       => [
                'id'    => $ws->owner->id,
                'name'  => $ws->owner->name,
                'email' => $ws->owner->email,
            ],
            'role'        => $currentMember ? $currentMember->role : 'member',
            'members'     => $ws->workspaceMembers->map(fn ($m) => [
                'id'    => $m->user->id,
                'name'  => $m->user->name,
                'email' => $m->user->email,
                'role'  => $m->role,
            ])->values(),
            'created_at'  => $ws->created_at,
        ];
    }
}
