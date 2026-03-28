# API Documentation

Base URL: `/api`
Auth: Laravel Sanctum (Bearer token), unless marked as **public**.

---

## Authentication

### POST /api/register
- **Auth:** Public
- **Body:** `{ "name": string, "email": string, "password": string }`
- **Response 201:** `{ "message": string, "user": { id, name, email, created_at }, "token": string }`

### POST /api/login
- **Auth:** Public (throttle: 6/min per IP)
- **Body:** `{ "email": string, "password": string }`
- **Response 200:** `{ "message": string, "user": { id, name, email, created_at }, "token": string }`
- **Response 401:** `{ "message": "Invalid credentials." }`

### POST /api/logout
- **Auth:** Bearer token required
- **Body:** N/A
- **Response 200:** `{ "message": "Logged out successfully." }`

### GET /api/user
- **Auth:** Bearer token required
- **Response 200:** `{ "id": int, "name": string, "email": string, "created_at": string }`

---

## Workspaces

### GET /api/workspaces
- **Auth:** Bearer token required
- **Response 200:** Array of workspace objects

### POST /api/workspaces
- **Auth:** Bearer token required
- **Body:** `{ "name": string }`
- **Response 201:** Workspace object

### GET /api/workspaces/{id}
- **Auth:** Bearer token required
- **Response 200:** Workspace object with members
- **Response 404:** `{ "error": "Not found." }`

### DELETE /api/workspaces/{workspaceId}/members/{userId}
- **Auth:** Bearer token required
- **Response 200:** `{ "message": string }`

---

## Invites

### POST /api/workspaces/{id}/invites
- **Auth:** Bearer token required
- **Body:** `{ "email": string }`
- **Response 201:** `{ "message": string, "token": string }`

### POST /api/invites/accept/{token}
- **Auth:** Bearer token required
- **Response 200:** `{ "message": string }`
- **Response 404:** `{ "error": "Invalid or expired invite." }`

---

## Flamengo

### GET /api/flamengo
- **Auth:** Public (no authentication required)
- **Body:** N/A
- **Response 200:**
```json
{
  "nome": "Hino do Flamengo",
  "letra": "Meu Flamengo lindo e valente,\nFlamengo do meu coração,\n..."
}
```
- **Response 5XX:** Internal server error (no custom body)

Added in: US-19
