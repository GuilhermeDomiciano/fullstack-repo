# API Contract: Initialize the Project

**Issue ID:** #1
**Tech Lead:** Tech Lead Agent
**Date:** 2026-03-11
**Status:** Defined

---

## 1. Overview

This document defines the API contract established during project initialization. At this stage, the contract covers the foundational HTTP conventions, base URL structure, response envelope format, and the single mandatory health-check endpoint that must be present in any running instance of the backend.

All future endpoints defined in subsequent user stories must conform to the conventions set here.

---

## 2. Base URL

| Environment | Base URL                        |
|-------------|----------------------------------|
| Development | `http://localhost:3000/api`      |
| Production  | `https://<domain>/api`           |

All API routes are prefixed with `/api`.

---

## 3. HTTP Conventions

- **Protocol:** HTTP/1.1 (HTTPS in production)
- **Data format:** JSON (`Content-Type: application/json`)
- **Character encoding:** UTF-8
- **HTTP methods used:** GET, POST, PUT, PATCH, DELETE
- **HTTP status codes:** Standard semantics apply (see Section 5)

---

## 4. Response Envelope

All API responses use a consistent JSON envelope.

### 4.1 Success Response

```json
{
  "success": true,
  "data": <payload>,
  "message": "<optional human-readable message>"
}
```

### 4.2 Error Response

```json
{
  "success": false,
  "error": {
    "code": "<ERROR_CODE>",
    "message": "<human-readable description>"
  }
}
```

### 4.3 Paginated Response (for future list endpoints)

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

## 5. HTTP Status Codes

| Status Code | Meaning                                      |
|-------------|----------------------------------------------|
| 200         | OK — Request succeeded                       |
| 201         | Created — Resource created successfully      |
| 204         | No Content — Request succeeded, no body      |
| 400         | Bad Request — Invalid input or parameters    |
| 401         | Unauthorized — Authentication required       |
| 403         | Forbidden — Authenticated but not permitted  |
| 404         | Not Found — Resource does not exist          |
| 409         | Conflict — Resource state conflict           |
| 422         | Unprocessable Entity — Validation error      |
| 500         | Internal Server Error — Unexpected failure   |

---

## 6. Endpoints

### 6.1 Health Check

This is the only endpoint required to be implemented as part of US-1. It serves as a signal that the backend server is running and reachable.

---

#### GET /api/health

Returns the current health status of the API server.

**Authentication:** None required

**Request**

```
GET /api/health
```

No request body or query parameters.

**Response — 200 OK**

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2026-03-11T00:00:00.000Z",
    "version": "1.0.0",
    "environment": "development"
  },
  "message": "Service is healthy"
}
```

| Field                  | Type   | Description                                      |
|------------------------|--------|--------------------------------------------------|
| data.status            | string | Always `"ok"` when the service is running        |
| data.timestamp         | string | ISO 8601 UTC timestamp of the response           |
| data.version           | string | Application version from `package.json`          |
| data.environment       | string | Value of `NODE_ENV` environment variable         |

**Response — 500 Internal Server Error**

```json
{
  "success": false,
  "error": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "Service is not healthy"
  }
}
```

---

## 7. Error Codes Reference

The following error codes are reserved for use across all stories:

| Code                  | Associated HTTP Status | Description                              |
|-----------------------|------------------------|------------------------------------------|
| `VALIDATION_ERROR`    | 422                    | One or more input fields failed validation |
| `NOT_FOUND`           | 404                    | Requested resource does not exist        |
| `UNAUTHORIZED`        | 401                    | Missing or invalid authentication token  |
| `FORBIDDEN`           | 403                    | Authenticated but lacks permission       |
| `CONFLICT`            | 409                    | Resource already exists or state conflict |
| `INTERNAL_ERROR`      | 500                    | Unhandled server-side error              |
| `SERVICE_UNAVAILABLE` | 500/503                | Downstream service or process failure    |

---

## 8. Headers

### 8.1 Request Headers

| Header          | Required | Description                          |
|-----------------|----------|--------------------------------------|
| `Content-Type`  | Yes (for POST/PUT/PATCH) | Must be `application/json` |
| `Accept`        | Recommended | Should be `application/json`      |
| `Authorization` | When authenticated | Bearer token (future stories) |

### 8.2 Response Headers

| Header            | Value                  | Description                         |
|-------------------|------------------------|-------------------------------------|
| `Content-Type`    | `application/json`     | All responses are JSON              |
| `X-Request-Id`    | UUID string            | Unique ID for tracing (to be added) |

---

## 9. Versioning Strategy

- The API is currently at **v1** (implicit, unversioned path prefix).
- If breaking changes are needed in the future, the path prefix will become `/api/v2/...`.
- The current `/api/...` prefix is equivalent to `/api/v1/...` and will remain stable.

---

## 10. CORS Policy

During development, the backend must allow requests from the frontend dev server:

- **Allowed origin (dev):** `http://localhost:5173`
- **Allowed methods:** GET, POST, PUT, PATCH, DELETE, OPTIONS
- **Allowed headers:** `Content-Type`, `Authorization`
- **Credentials:** Allowed

In production, the allowed origin must be restricted to the deployed frontend domain.

---

## 11. Notes for Dev Backend Agent

- Implement the `GET /api/health` endpoint as the first route.
- Use an Express Router in `src/backend/routes/healthRoutes.js`.
- Mount the router at `/api` in `src/backend/index.js`.
- The `version` field in the health response must be read dynamically from `package.json`.
- Add CORS middleware using the `cors` npm package, configured per Section 10.
- The health endpoint must have a corresponding unit test in `tests/backend/health.test.js`.

---

## 12. Notes for Dev Frontend Agent

- The frontend must read the API base URL from the `VITE_API_BASE_URL` environment variable.
- Create a central API client module at `src/frontend/services/apiClient.js`.
- The API client must prepend the base URL to all requests and enforce the `Content-Type: application/json` header.
- On startup, the frontend may optionally call `GET /api/health` to verify backend connectivity.
