# US-9 — Docker Containerization — Implementation Summary

## What was implemented

### Files Created

| File | Description |
|------|-------------|
| `docker-compose.yml` | Root-level Compose v3.9 orchestration for backend + frontend |
| `backend/docker-entrypoint.sh` | Runtime entrypoint: creates .env, generates APP_KEY, creates SQLite file, runs migrations |
| `backend/.dockerignore` | Excludes vendor, .env, logs, sqlite db, tests from backend build context |
| `frontend/Dockerfile` | Two-stage build: Node 20 Alpine (npm build) + nginx stable-alpine (serve) |
| `frontend/nginx.conf` | nginx config proxying /api/ to backend container, SPA fallback to index.html |
| `frontend/.dockerignore` | Excludes node_modules, dist, .env files from frontend build context |
| `.dockerignore` | Root-level ignore for .git, tasks/, markdown files |

### Files Modified

| File | Change |
|------|--------|
| `backend/Dockerfile` | Removed build-time migration and .env copy; added entrypoint script; SQLite file creation moved to runtime |
| `README.md` | Added "Docker (Recommended)" section with start/stop commands, service URLs, volume persistence info, and environment variable table |

---

## Services

| Service | Container Name | Port Mapping | Image Base |
|---------|---------------|--------------|------------|
| backend | fusionrun_backend | 8000:8000 | php:8.2-fpm-alpine |
| frontend | fusionrun_frontend | 3000:80 | node:20-alpine + nginx:stable-alpine |

---

## Key Design Decisions

### SQLite Persistence via Named Volume
- The SQLite database file lives at `/var/www/database/database.sqlite` inside the container.
- A named Docker volume `sqlite_data` is mounted at `/var/www/database`, so data survives `docker-compose down` and container restarts.
- Only `docker-compose down -v` removes the data.

### Runtime Entrypoint (not build-time migrations)
- The original Dockerfile ran `php artisan migrate --force` during the image build, which baked the SQLite file into the image — incompatible with volume mounts.
- `backend/docker-entrypoint.sh` creates the SQLite file and runs migrations at container startup, after volumes are mounted.

### Frontend nginx Proxy
- The React build does not embed an API URL. Instead, the nginx config proxies `/api/*` requests to `http://backend:8000` using Docker's internal DNS.
- This means the same built image works regardless of where the backend is hosted, as long as the service name is `backend`.

### Health Checks
- Backend: polls `http://localhost:8000/up` (Laravel's built-in `/up` health endpoint) every 30s with 40s start period.
- Frontend: polls `http://localhost:80` every 30s.
- `depends_on: backend: condition: service_healthy` ensures the frontend container only starts once the backend is accepting connections.

---

## Usage

```bash
# Start all services (first run: builds images)
docker-compose up --build

# Start in background
docker-compose up -d --build

# Stop all services (data preserved)
docker-compose down

# Stop and delete all data
docker-compose down -v

# Rebuild after code changes
docker-compose up --build
```

After startup:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
