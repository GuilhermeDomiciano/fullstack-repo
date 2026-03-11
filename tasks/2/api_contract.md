# API Contract: Authentication System (Story #2)

## Overview

This document defines the API contract for the authentication system. The backend is implemented with Laravel and exposes a RESTful JSON API using Laravel Sanctum for token-based authentication.

All requests and responses use `Content-Type: application/json`.

Base URL prefix: `/api`

---

## Endpoints

### 1. Register

**POST** `/api/register`

Creates a new user account.

#### Request Body

```json
{
  "name": "string, required, max:255",
  "email": "string, required, valid email, unique, max:255",
  "password": "string, required, min:8",
  "password_confirmation": "string, required, must match password"
}
```

#### Success Response — 201 Created

```json
{
  "message": "Registration successful.",
  "user": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "created_at": "2026-03-11T10:00:00Z"
  },
  "token": "<sanctum_plain_text_token>"
}
```

#### Error Response — 422 Unprocessable Entity

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email has already been taken."],
    "password": ["The password confirmation does not match."]
  }
}
```

---

### 2. Login

**POST** `/api/login`

Authenticates an existing user and returns a token.

#### Request Body

```json
{
  "email": "string, required, valid email",
  "password": "string, required"
}
```

#### Success Response — 200 OK

```json
{
  "message": "Login successful.",
  "user": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "created_at": "2026-03-11T10:00:00Z"
  },
  "token": "<sanctum_plain_text_token>"
}
```

#### Error Response — 401 Unauthorized

```json
{
  "message": "Invalid credentials."
}
```

#### Error Response — 422 Unprocessable Entity

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

---

### 3. Logout

**POST** `/api/logout`

Revokes the current user's authentication token.

Requires authentication.

#### Request Headers

```
Authorization: Bearer <sanctum_plain_text_token>
```

#### Request Body

None.

#### Success Response — 200 OK

```json
{
  "message": "Logged out successfully."
}
```

#### Error Response — 401 Unauthorized

```json
{
  "message": "Unauthenticated."
}
```

---

### 4. Get Authenticated User

**GET** `/api/user`

Returns the currently authenticated user's profile.

Requires authentication.

#### Request Headers

```
Authorization: Bearer <sanctum_plain_text_token>
```

#### Success Response — 200 OK

```json
{
  "id": 1,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "created_at": "2026-03-11T10:00:00Z"
}
```

#### Error Response — 401 Unauthorized

```json
{
  "message": "Unauthenticated."
}
```

---

## Authentication Mechanism

- Laravel Sanctum is used for token-based API authentication.
- On successful register or login, the server returns a plain-text token.
- The frontend must store this token (e.g., in localStorage or a secure cookie) and attach it to every authenticated request via the `Authorization: Bearer <token>` header.
- On logout, the token is revoked server-side and must be discarded client-side.
- Tokens do not expire automatically; logout is the mechanism to invalidate them.

---

## HTTP Status Code Summary

| Status | Meaning                              |
|--------|--------------------------------------|
| 200    | OK — request succeeded               |
| 201    | Created — resource created           |
| 401    | Unauthorized — invalid or missing token |
| 422    | Unprocessable Entity — validation failed |
| 500    | Internal Server Error                |

---

## Data Model: User

| Field        | Type      | Notes                         |
|--------------|-----------|-------------------------------|
| id           | integer   | Auto-increment primary key    |
| name         | string    | Max 255 characters            |
| email        | string    | Unique, max 255 characters    |
| password     | string    | Bcrypt hashed, never exposed  |
| created_at   | timestamp | ISO 8601                      |
| updated_at   | timestamp | ISO 8601                      |

The `password` field is never included in any API response.

---

## Security Notes

- Passwords are hashed using bcrypt via Laravel's `Hash::make()`.
- All endpoints must be served over HTTPS in production.
- Rate limiting should be applied to `/api/login` and `/api/register` to mitigate brute-force attacks (Laravel's `throttle:6,1` middleware recommended).
- CORS must be configured to allow requests only from the known frontend origin.
