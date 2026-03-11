# Technical Specification: Initialize the Project

**Issue ID:** #1
**Tech Lead:** Tech Lead Agent
**Date:** 2026-03-11
**Status:** Defined

---

## 1. Overview

This specification defines the technical foundation for the fullstack repository project. It establishes the directory structure, tooling, configuration conventions, and API contract baseline that all subsequent development work will build upon.

---

## 2. Technology Stack

### Backend
- **Runtime:** Node.js (LTS)
- **Framework:** Express.js
- **Language:** JavaScript (ES2022+)
- **Package Manager:** npm

### Frontend
- **Framework:** React (with Vite as build tool)
- **Language:** JavaScript (ES2022+)
- **Styling:** CSS Modules

### Testing
- **Backend:** Jest
- **Frontend:** Vitest + React Testing Library

### Tooling
- **Linter:** ESLint
- **Formatter:** Prettier
- **Git Hooks:** Husky + lint-staged
- **CI/CD:** GitHub Actions

---

## 3. Project Directory Structure

The repository is a monorepo with the following top-level layout:

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
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── package.json          # Root package manifest
└── README.md
```

---

## 4. Configuration Files

### 4.1 package.json (root)

The root `package.json` manages workspaces and shared scripts.

Key scripts:
- `npm run dev` — Start both backend and frontend in development mode
- `npm run build` — Build frontend for production
- `npm test` — Run all tests
- `npm run lint` — Run ESLint across the codebase
- `npm run format` — Run Prettier across the codebase

### 4.2 Environment Variables

The `.env.example` file defines all required environment variables:

```
# Server
NODE_ENV=development
PORT=3000

# Frontend
VITE_API_BASE_URL=http://localhost:3000/api
```

### 4.3 ESLint

Configuration file: `.eslintrc.json`
- Extends: `eslint:recommended`
- Environments: `node`, `browser`, `es2022`
- No unused variables, no console statements in production

### 4.4 Prettier

Configuration file: `.prettierrc`
- Single quotes: `true`
- Semi-colons: `true`
- Tab width: `2`
- Trailing commas: `es5`
- Print width: `100`

### 4.5 .gitignore

Standard Node.js and React ignores:
- `node_modules/`
- `dist/`
- `.env`
- Build artifacts and OS-specific files

---

## 5. Git Workflow

- **Main branch:** `main` (protected)
- **Feature branches:** `us-<issue-id>` naming convention
- **Commit message convention:** Imperative mood, present tense (e.g., "add user auth route")
- **Pre-commit hooks (Husky):** Run lint-staged to enforce ESLint + Prettier on staged files before each commit
- **PR requirement:** All changes must go through a pull request; direct pushes to `main` are not allowed

---

## 6. CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`) triggers on:
- Push to any branch
- Pull requests targeting `main`

Pipeline stages:
1. **Install** — `npm install`
2. **Lint** — `npm run lint`
3. **Test** — `npm test`
4. **Build** — `npm run build`

---

## 7. Developer Onboarding Steps

The README must document the following setup flow:

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in values
3. Run `npm install` at the root
4. Run `npm run dev` to start the development server
5. Open `http://localhost:5173` for the frontend and `http://localhost:3000` for the backend API

---

## 8. Responsibilities

| Agent         | Responsibility                                                  |
|---------------|------------------------------------------------------------------|
| Dev Backend   | Set up `src/backend/`, `tests/backend/`, Express entry point, health-check route |
| Dev Frontend  | Set up `src/frontend/`, `tests/frontend/`, Vite config, placeholder App component |
| Both          | Each creates their own `package.json` if using workspaces        |
| Tech Lead     | Root config files, CI workflow, `.env.example`, README baseline  |

---

## 9. Out of Scope

- Database setup (deferred to a future story)
- Authentication/authorization (deferred to a future story)
- Production deployment configuration (deferred to a future story)
