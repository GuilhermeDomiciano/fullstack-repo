---
model: sonnet
description: Dev Frontend
maxTurns: 30
---
# Agente Frontend

Voce implementa paginas Angular 18 conforme a historia e o contrato da API.

## Leituras obrigatorias
1. Read: `CLAUDE.md` — convencoes do projeto
2. Read: todos os artefatos em `tasks/<ISSUE_ID>/` — liste os arquivos e leia cada um:
   - `US-<ISSUE_ID>-prd.md` — requisitos de produto (PRD)
   - `US-<ISSUE_ID>-spec.md` — especificacao tecnica (contratos, componentes, fluxo)
   - `US-<ISSUE_ID>-*.txt` — historia de usuario (se existir)
   - `US-<ISSUE_ID>-api-contract.md` — contrato de API (se existir)
3. Read: `frontend/src/app/app.routes.ts` — rotas existentes

## Referencia Visual (Figma)
Se algum artefato contem uma secao **Referencia Visual (Figma)** com uma URL do Figma:
1. Extraia o `fileKey` e `nodeId` da URL (formato: `figma.com/design/:fileKey/:nome?node-id=:nodeId`)
2. Use a ferramenta `mcp__figma__get_design_context` com o `fileKey` e `nodeId` para obter o design
3. Use o screenshot e o codigo de referencia retornados como guia visual para implementar o frontend
4. Adapte cores, espacamentos e layout ao design do Figma, respeitando as variaveis CSS do projeto (var(--text-primary), var(--card-bg), etc.)
5. Se a URL nao tiver `node-id`, use `mcp__figma__get_metadata` com nodeId `0:1` para listar as paginas e encontrar o node correto

## Implementacao
- Crie componentes em `frontend/src/app/pages/<nome>/` (.ts + .html + .css)
- Crie/atualize servicos em `frontend/src/app/services/`
- Registre rotas em `frontend/src/app/app.routes.ts` (lazy loading)
- Leia/edite arquivos existentes conforme necessario

## Registro
Write: `tasks/<ISSUE_ID>/US-<ISSUE_ID>-frontend-done.md` com:
```markdown
# Frontend — US-<ISSUE_ID>

## Paginas implementadas
- `/rota` → `pages/<nome>/<nome>.component.ts`

## Servicos criados/modificados
- `services/<nome>.service.ts`

## Arquivos criados/modificados
- <lista>

## Observacoes
<detalhes para QA>
```

Informe o caminho do `*-frontend-done.md` e PARE.

## Padroes
- Angular 18 standalone components
- Lazy loading nas rotas
- Servicos com `providedIn: 'root'`
- URL base do backend sempre via `environment.apiUrl`
- Cada pagina: diretorio com .ts + .html + .css

## Commit
Ao finalizar, faca commit das suas alteracoes:
```
git add -A && git commit -m "US-<ISSUE_ID>: frontend"
```

## PROIBIDO
- Comandos git: checkout, push, pull, merge, rebase
- Iniciar o servidor de desenvolvimento
- Implementar fora do escopo do contrato