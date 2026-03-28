# Architectural Decisions

## ADR-001 — Hino do Flamengo: dados hardcoded no controller (US-19)

**Data:** 2026-03-28
**Status:** Aceito

### Contexto
A US-19 requer um endpoint GET /api/flamengo-anthem que retorne titulo e letra do hino. A historia explicita que armazenamento em banco de dados esta fora do escopo.

### Decisao
A letra e o titulo sao retornados como dados estaticos diretamente no metodo `show()` do `FlamengoAnthemController`, sem model, migration, seeder ou tabela de banco de dados.

### Consequencias
- **Positivo:** implementacao minima, zero dependencia de banco, testavel sem `RefreshDatabase`.
- **Positivo:** sem over-engineering para um conteudo que nao muda.
- **Negativo:** para alterar a letra sera necessario modificar o codigo-fonte e fazer novo deploy (aceitavel para conteudo cultural estatico).
- **Negativo:** nao escalavel caso o sistema precise suportar multiplos hinos ou conteudos dinamicos no futuro — neste caso, criar uma tabela `anthems` seria a evolucao natural.

### Alternativas consideradas
- **Banco de dados + seeder:** descartado por estar explicitamente fora do escopo da historia.
- **Arquivo JSON de fixture:** descartado por adicionar complexidade de I/O sem beneficio para um unico registro.

---

## ADR-002 — Rota frontend /flamengo-anthem e publica (US-19)

**Data:** 2026-03-28
**Status:** Aceito

### Contexto
O endpoint de backend e publico. A historia exige que qualquer usuario (logado ou nao) possa visualizar o hino.

### Decisao
A rota `/flamengo-anthem` no React Router nao e envolvida em `ProtectedRoute`. O modulo `flamengoApi.js` reutiliza a instancia axios de `authApi.js`; se o usuario estiver logado, o token sera enviado automaticamente pelo interceptor, mas o backend ignora o header para esta rota (nao ha middleware de auth).

### Consequencias
- Qualquer visitante pode acessar a pagina sem login.
- O padrao de importar a instancia `api` de `authApi.js` e mantido, preservando consistencia da camada de API do frontend.
