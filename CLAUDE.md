```markdown
# CLAUDE.md

## Stack

- **Backend:** Laravel (PHP) — porta 8000
- **Frontend:** React 19 + Vite + React Router DOM + Axios — porta 5173
- **Auth:** Laravel Sanctum (token-based)
- **Infra:** Docker + docker-compose (containers para backend, frontend e banco)
- **Testes backend:** PHPUnit (`phpunit.xml`)
- **Linter frontend:** ESLint 9

## Estrutura

```
backend/
├── app/Http/          # Controllers, Middleware, Requests
├── app/Models/        # Eloquent Models
├── config/            # cors.php, sanctum.php e outros
├── database/
│   ├── migrations/    # Migrations (rodam automaticamente)
│   ├── seeders/       # Seeders de dados iniciais
│   └── factories/     # Factories para testes
├── routes/
│   ├── api.php        # Rotas da API REST
│   └── web.php        # Rotas web (geralmente só health)
└── tests/Feature/     # Testes PHPUnit

frontend/
├── src/
│   ├── api/           # Chamadas HTTP (axios)
│   ├── components/    # Componentes reutilizáveis
│   ├── context/       # React Context (estado global)
│   ├── pages/         # Páginas mapeadas às rotas
│   └── App.jsx        # Rotas principais (react-router-dom)
└── vite.config.js

tasks/                 # Artefatos de cada US (user stories, specs, done reports)
docker-compose.yml     # Orquestração dos serviços
```

## Comandos

### Ambiente

```bash
docker-compose up -d          # Sobe todos os serviços (backend + frontend + banco)
docker-compose down           # Para os serviços
docker-compose logs -f        # Acompanha logs em tempo real
```

### Backend (dentro do container ou com PHP local)

```bash
php artisan migrate           # Roda migrations pendentes
php artisan migrate:fresh --seed  # Reseta banco e popula com seeders
php artisan make:model Foo -mcr   # Model + Migration + Controller + Resource
php artisan route:list        # Lista todas as rotas
php artisan tinker            # REPL interativo
./vendor/bin/phpunit          # Roda testes PHPUnit
```

### Frontend

```bash
cd frontend
npm run dev       # Dev server (Vite, porta 5173)
npm run build     # Build de produção
npm run lint      # Lint com ESLint
npm run preview   # Preview do build de produção
```

## Convenções

- **API REST** — todos os endpoints definidos em `backend/routes/api.php`, prefixo `/api`
- **Autenticação** — Laravel Sanctum; endpoints protegidos usam middleware `auth:sanctum`
- **CORS** — configurado em `config/cors.php`; ajustar `allowed_origins` se necessário
- **Models** — Eloquent com fillable explícito; relações definidas no próprio Model
- **Controllers** — Resource controllers sempre que possível; lógica de negócio no Service ou diretamente no Controller (sem over-engineering)
- **Frontend API layer** — chamadas HTTP centralizadas em `src/api/`; nunca fazer axios direto dentro de componentes
- **Estado global** — React Context em `src/context/`; usar apenas para estado realmente global (auth, user)
- **Páginas vs Componentes** — `pages/` para rotas, `components/` para elementos reutilizáveis

## Fluxo de trabalho com tasks

Artefatos de cada US ficam em `tasks/<N>/`:

```
tasks/11/
├── US-11-spec.md          # Especificação (O QUÊ fazer)
├── US-11-execute-done.md  # Registro do que foi implementado
└── US-11-review.md        # Resultado da revisão/QA
```

## Boas práticas

- Rodar `php artisan migrate` após puxar mudanças que incluam novas migrations
- Nunca hardcodar URLs — usar variáveis de ambiente (`VITE_API_URL` no frontend, `.env` no backend)
- Manter migrations idempotentes; nunca editar migration já em produção — criar nova
- Testes PHPUnit em `tests/Feature/` para cada endpoint criado
- Usar `php artisan make:request` para validação de inputs na camada HTTP
- Frontend: importar axios a partir de `src/api/`, nunca instanciar diretamente
```

## Squad Workflow

This workspace is being operated by a squad of AI agents.

Pipeline:
1. Product Owner
2. Tech Lead
3. Dev Backend + Dev Frontend (parallel)
4. QA
5. PR

Flow: Product Owner → Tech Lead → [Dev Backend | Dev Frontend] → QA → PR
