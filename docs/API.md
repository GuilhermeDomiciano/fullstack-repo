# API Reference

Base URL: `/api`
Auth: Laravel Sanctum (Bearer token), exceto onde indicado como publico.

---

## Autenticacao

### POST /api/register
- **Auth:** Publica (throttle: 6 req/min por IP)
- **Body:** `{ name: string, email: string, password: string, password_confirmation: string }`
- **200:** `{ token: string, user: { id, name, email } }`
- **422:** `{ errors: { campo: [mensagem] } }`

### POST /api/login
- **Auth:** Publica (throttle: 6 req/min por IP)
- **Body:** `{ email: string, password: string }`
- **200:** `{ token: string, user: { id, name, email } }`
- **401:** `{ error: "Credenciais invalidas" }`

### POST /api/logout
- **Auth:** Requer token Sanctum
- **Body:** N/A
- **200:** `{ message: "Logout realizado com sucesso" }`

### GET /api/user
- **Auth:** Requer token Sanctum
- **200:** `{ id, name, email, ... }`

---

## Workspaces

### GET /api/workspaces
- **Auth:** Requer token Sanctum
- **200:** `[ { id, name, ... } ]`

### POST /api/workspaces
- **Auth:** Requer token Sanctum
- **Body:** `{ name: string }`
- **201:** `{ id, name, ... }`

### GET /api/workspaces/{id}
- **Auth:** Requer token Sanctum
- **200:** `{ id, name, members: [...], ... }`
- **404:** `{ error: "Workspace nao encontrado" }`

### DELETE /api/workspaces/{workspaceId}/members/{userId}
- **Auth:** Requer token Sanctum
- **200:** `{ message: "Membro removido" }`

---

## Invites

### POST /api/workspaces/{id}/invites
- **Auth:** Requer token Sanctum
- **Body:** `{ email: string }`
- **201:** `{ message: "Convite enviado" }`

### POST /api/invites/accept/{token}
- **Auth:** Requer token Sanctum
- **200:** `{ message: "Convite aceito" }`
- **404:** `{ error: "Token invalido ou expirado" }`

---

## Conteudo Cultural

### GET /api/flamengo-anthem
- **Auth:** Publica (sem autenticacao)
- **Body:** N/A
- **200:**
  ```json
  {
    "title": "Hino do Flamengo",
    "lyrics": "<letra completa, linhas separadas por \\n>"
  }
  ```
- **Notas:** Dados estaticos (hardcoded no controller). Letra autentica de Lamartine Babo. Introduzido na US-19.
