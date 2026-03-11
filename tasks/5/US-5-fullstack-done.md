# US-5: Make a Workspace — Fullstack Done

## Summary

Implemented the full workspace feature: creation, member management, and invite-link flow.

---

## Backend (Laravel)

### Migration
- `backend/database/migrations/2025_01_01_000001_create_workspaces_table.php`
  - Table `workspaces`: id, name, description, owner_id, timestamps
  - Table `workspace_members`: id, workspace_id, user_id, role (owner|member), timestamps, unique(workspace_id, user_id)
  - Table `workspace_invites`: id, workspace_id, token, email, invited_by, accepted_at, expires_at, timestamps

### Models
- `backend/app/Models/Workspace.php` — relationships: owner, members (BelongsToMany), workspaceMembers (HasMany), invites (HasMany), `hasMember()` helper
- `backend/app/Models/WorkspaceMember.php` — fillable: workspace_id, user_id, role
- `backend/app/Models/WorkspaceInvite.php` — fillable with casts; `isExpired()` and `isAccepted()` helpers

### Requests
- `backend/app/Http/Requests/CreateWorkspaceRequest.php` — validates name (required), description (nullable)
- `backend/app/Http/Requests/CreateInviteRequest.php` — validates email (nullable, email)

### Controllers
- `backend/app/Http/Controllers/WorkspaceController.php`
  - `GET /api/workspaces` — list workspaces the authenticated user belongs to
  - `POST /api/workspaces` — create workspace; creator is added as owner member
  - `GET /api/workspaces/{id}` — show single workspace (403 if not member)
  - `DELETE /api/workspaces/{workspaceId}/members/{userId}` — remove member (owner only, 204)
- `backend/app/Http/Controllers/InviteController.php`
  - `POST /api/workspaces/{id}/invites` — generate invite token (expires 7 days); returns token + invite_url
  - `POST /api/invites/accept/{token}` — accept invite; adds authenticated user as member

### Routes
- `backend/routes/api.php` — all workspace and invite routes registered under `auth:sanctum` middleware

---

## Frontend (React)

### API Service
- `frontend/src/api/workspaceApi.js`
  - `getWorkspaces`, `getWorkspace`, `createWorkspace`, `createInvite`, `acceptInvite`, `removeMember`

### Pages
- `frontend/src/pages/WorkspacesPage.jsx` — list all user workspaces, inline create-workspace form, navigate to workspace on create
- `frontend/src/pages/WorkspacePage.jsx` — workspace detail: info card, invite-link generator with copy button, members list with remove button (owner only)
- `frontend/src/pages/AcceptInvitePage.jsx` — accept invite by token; redirects to workspace on success, handles expired/used invites

### Modified Files
- `frontend/src/App.jsx` — added routes: `/workspaces`, `/workspaces/:id`, `/invites/accept/:token`
- `frontend/src/pages/DashboardPage.jsx` — added "View my Workspaces" link button
- `frontend/src/index.css` — added styles for workspace list, workspace cards, badges (owner/member), invite form, invite result, members list, danger button, alert-success

---

## Endpoints Implemented

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/workspaces | List user's workspaces |
| POST | /api/workspaces | Create workspace |
| GET | /api/workspaces/{id} | Get workspace detail |
| POST | /api/workspaces/{id}/invites | Generate invite link |
| POST | /api/invites/accept/{token} | Accept invite |
| DELETE | /api/workspaces/{workspaceId}/members/{userId} | Remove member |
