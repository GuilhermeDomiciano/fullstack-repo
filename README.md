# Fusion Run

A fullstack monorepo project built with Node.js/Express (backend) and React/Vite (frontend).

## Project Structure

```
/
├── src/
│   ├── backend/          # Express API server
│   │   ├── routes/       # Route definitions
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # Data models
│   │   └── index.js      # Server entry point
│   └── frontend/         # React application
│       ├── components/   # Reusable UI components
│       ├── pages/        # Page-level components
│       ├── hooks/        # Custom React hooks
│       ├── services/     # API client functions
│       ├── assets/       # Static assets
│       └── main.jsx      # Frontend entry point
├── tests/
│   ├── backend/          # Backend unit and integration tests
│   └── frontend/         # Frontend unit and component tests
├── docs/                 # Project documentation
├── config/               # Shared configuration files
├── .github/
│   └── workflows/        # GitHub Actions CI/CD workflows
├── .env.example          # Environment variable template
└── package.json
```

## Setup Instructions

### Prerequisites

- Node.js (LTS version recommended)
- npm

### Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd fusion-run
   ```

2. Copy the environment template and fill in values:
   ```bash
   cp .env.example .env
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Access the services:
   - Backend API: `http://localhost:3000`
   - Health check: `http://localhost:3000/api/health`
   - Frontend (once set up): `http://localhost:5173`

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the backend server in development mode |
| `npm run build` | Build the frontend for production |
| `npm test` | Run all backend tests |
| `npm run lint` | Run ESLint across the codebase |
| `npm run format` | Run Prettier to format the codebase |

## API Overview

All API endpoints are prefixed with `/api`. Responses follow a consistent JSON envelope:

**Success:**
```json
{
  "success": true,
  "data": {},
  "message": "optional message"
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description"
  }
}
```

### Health Check

`GET /api/health` — Returns the current health status of the API server. No authentication required.

## Development Workflow

- Feature branches follow the naming convention `us-<issue-id>`
- All changes must go through a pull request targeting `main`
- Direct pushes to `main` are not permitted
- Commit messages use imperative mood, present tense (e.g., "add user auth route")

## Contributing

1. Create a branch from `main` using the `us-<issue-id>` naming convention
2. Implement your changes with tests
3. Ensure `npm run lint` and `npm test` pass locally
4. Open a pull request targeting `main`
5. Wait for CI checks to pass and request a review

## CI/CD

GitHub Actions runs automatically on every push and pull request to `main`:
1. Install dependencies
2. Lint
3. Test
4. Build
