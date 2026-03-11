# Fullstack App

A fullstack web application built with **Laravel 11** (backend) and **React + Vite** (frontend), featuring token-based authentication via Laravel Sanctum.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Docker (Recommended)](#docker-recommended)
- [Directory Structure](#directory-structure)
- [Backend Setup (Laravel)](#backend-setup-laravel)
- [Frontend Setup (React + Vite)](#frontend-setup-react--vite)
- [Running the Application](#running-the-application)
- [Authentication System](#authentication-system)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)

---

## Docker (Recommended)

Docker is the fastest way to run the full application stack (backend + frontend) without installing PHP, Composer, or Node.js on your machine.

### Prerequisites for Docker

| Tool | Minimum Version |
|------|----------------|
| Docker | 24.x+ |
| Docker Compose | 2.x (plugin) |

### Start all services

From the repository root, run:

```bash
docker-compose up --build
```

This single command will:
1. Build the backend image (PHP 8.2, Laravel 11) and run database migrations.
2. Build the frontend image (Node 20 build stage, nginx serving stage).
3. Start both containers and expose the application.

Once running:

| Service | URL |
|---------|-----|
| Frontend (React) | http://localhost:3000 |
| Backend API (Laravel) | http://localhost:8000 |

> The frontend nginx container proxies all `/api/*` requests to the backend container automatically, so no CORS configuration is needed.

### Stop all services

```bash
docker-compose down
```

### Stop and remove volumes (deletes SQLite data)

```bash
docker-compose down -v
```

### Data persistence

The SQLite database is stored in a named Docker volume (`sqlite_data`) and survives container restarts. To confirm:

```bash
docker-compose down   # stop
docker-compose up -d  # restart — all data is preserved
```

### Environment variables

All backend environment variables are defined directly in `docker-compose.yml` under the `backend.environment` key. Override any value there before building. The key variables are:

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_ENV` | `local` | Laravel environment |
| `APP_DEBUG` | `true` | Enable debug mode |
| `APP_URL` | `http://localhost:8000` | Backend URL |
| `DB_CONNECTION` | `sqlite` | Database driver |
| `FRONTEND_URL` | `http://localhost:3000` | Allowed CORS origin |

### Health checks

Both services include health checks. The backend is checked against `http://localhost:8000/up` (Laravel's built-in health endpoint). The frontend depends on the backend being healthy before starting.

---

## Prerequisites

Make sure the following tools are installed on your system before you begin:

| Tool | Minimum Version |
|------|----------------|
| PHP | 8.2+ |
| Composer | 2.x |
| Node.js | 18.x+ |
| npm | 9.x+ |

To verify your installed versions:

```bash
php --version
composer --version
node --version
npm --version
```

---

## Directory Structure

```
fusion-run/
├── backend/                  # Laravel 11 application
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/  # AuthController, etc.
│   │   │   └── Requests/     # Form request validation
│   │   └── Models/           # Eloquent models (User, etc.)
│   ├── config/               # Laravel configuration files
│   ├── database/
│   │   ├── migrations/       # Database migrations
│   │   ├── factories/        # Model factories
│   │   └── seeders/          # Database seeders
│   ├── routes/
│   │   └── api.php           # API route definitions
│   ├── storage/              # Logs, cache, and session files
│   ├── .env.example          # Environment variable template
│   └── composer.json         # PHP dependencies
│
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── api/              # Axios API client (authApi.js)
│   │   ├── components/       # Shared components (ProtectedRoute, etc.)
│   │   ├── context/          # React context (AuthContext)
│   │   ├── pages/            # Page components (Login, Register, Dashboard)
│   │   ├── App.jsx           # Root component and router setup
│   │   └── main.jsx          # Application entry point
│   ├── public/               # Static assets
│   ├── vite.config.js        # Vite configuration (port 3000, proxy to 8000)
│   └── package.json          # Node.js dependencies
│
└── README.md
```

---

## Backend Setup (Laravel)

Follow these steps from the root of the repository:

### 1. Navigate to the backend directory

```bash
cd backend
```

### 2. Install PHP dependencies

```bash
composer install
```

### 3. Create the environment file

```bash
cp .env.example .env
```

### 4. Configure the environment file

Open `backend/.env` and update the database settings to use SQLite:

```env
APP_NAME="Fullstack App"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
# DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD can be left commented out
```

> **Note:** The remaining default values in `.env.example` work for local development without modification.

### 5. Generate the application key

```bash
php artisan key:generate
```

### 6. Create the SQLite database file

```bash
touch database/database.sqlite
```

### 7. Run the database migrations

```bash
php artisan migrate
```

---

## Frontend Setup (React + Vite)

Follow these steps from the root of the repository:

### 1. Navigate to the frontend directory

```bash
cd frontend
```

### 2. Install Node.js dependencies

```bash
npm install
```

---

## Running the Application

The backend and frontend must be run simultaneously in separate terminal windows.

### Start the backend (port 8000)

```bash
cd backend
php artisan serve
```

The Laravel API will be available at: `http://localhost:8000`

### Start the frontend (port 3000)

```bash
cd frontend
npm run dev
```

The React application will be available at: `http://localhost:3000`

> **Note:** The Vite development server is configured to proxy all `/api/*` requests to `http://localhost:8000`, so no additional CORS configuration is needed in development.

---

## Authentication System

This application uses **Laravel Sanctum** for token-based API authentication.

### How it works

1. The user submits their credentials (email + password) to `POST /api/login`.
2. Laravel Sanctum validates the credentials and returns a **plain-text API token**.
3. The frontend stores this token and attaches it to subsequent requests via the `Authorization: Bearer <token>` header.
4. Protected routes on the backend verify the token using the `auth:sanctum` middleware before processing the request.
5. On logout, the token is revoked server-side via `POST /api/logout`.

### Public routes

- `POST /api/register` — Create a new user account
- `POST /api/login` — Authenticate and receive a token

### Protected routes (require `Authorization: Bearer <token>` header)

- `POST /api/logout` — Revoke the current token
- `GET /api/user` — Retrieve the authenticated user's details

### Rate limiting

Authentication endpoints (`/api/register` and `/api/login`) are rate-limited to **6 requests per minute per IP address** to protect against brute-force attacks.

---

## API Endpoints

| Method | Path | Auth Required | Description |
|--------|------|:-------------:|-------------|
| `POST` | `/api/register` | No | Register a new user |
| `POST` | `/api/login` | No | Log in and receive an API token |
| `POST` | `/api/logout` | Yes | Revoke the current token and log out |
| `GET` | `/api/user` | Yes | Get the authenticated user's profile |

### Example: Register

```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "password", "password_confirmation": "password"}'
```

### Example: Login

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email": "john@example.com", "password": "password"}'
```

### Example: Get authenticated user

```bash
curl -X GET http://localhost:8000/api/user \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Troubleshooting

### 1. `php artisan serve` fails with "No application encryption key has been specified"

This happens when the `APP_KEY` is not set in your `.env` file.

**Solution:** Run the key generation command:

```bash
cd backend
php artisan key:generate
```

---

### 2. Migration fails with "Database file does not exist" or SQLite errors

The SQLite database file must exist before running migrations.

**Solution:** Create the file manually, then run migrations:

```bash
cd backend
touch database/database.sqlite
php artisan migrate
```

---

### 3. Frontend shows "Network Error" or API requests fail

This usually means the backend server is not running or is running on a different port.

**Solution:**
- Confirm the backend is running: `php artisan serve` (should output `Server running on http://127.0.0.1:8000`)
- Confirm the frontend Vite proxy target in `frontend/vite.config.js` points to `http://localhost:8000`
- Check that no firewall or other process is blocking port 8000

---

### 4. `composer install` fails due to missing PHP extensions

The backend requires the `pdo_sqlite` PHP extension.

**Solution (Ubuntu/Debian):**

```bash
sudo apt install php8.2-sqlite3
```

**Solution (macOS with Homebrew):**

```bash
brew install php
```

PHP installed via Homebrew includes SQLite support by default.

---

### 5. Port 3000 or 8000 is already in use

**Solution:** Identify and stop the process using the port, or start the server on a different port:

```bash
# Start backend on a different port
php artisan serve --port=8001

# Start frontend on a different port (update vite.config.js proxy target accordingly)
npm run dev -- --port=3001
```
