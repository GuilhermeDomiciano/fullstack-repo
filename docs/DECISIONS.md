# Architectural Decisions

---

## 2026-03-28 — US-19: Endpoint /api/flamengo sem banco de dados

**Contexto:** A US-19 requer um endpoint que retorne a letra do Hino do Flamengo.

**Decisao:** A letra do hino e retornada como string hardcoded diretamente no controller (`FlamengoController`), sem criacao de tabela, migration ou model Eloquent.

**Motivacao:**
- A US explicita "Fora do Escopo: criar tabelas ou modelos de banco de dados para armazenar o hino (pode ser hardcoded)"
- O conteudo e estatico, imutavel e de dominio publico — nao ha necessidade de persistencia
- Evita over-engineering, alinhado com as convencoes do projeto

**Consequencias:**
- Alterar a letra exige deploy de codigo (sem painel de administracao)
- Nao ha dependencias de banco de dados para este endpoint

---

## 2026-03-28 — US-19: Rota /flamengo publica no frontend

**Contexto:** A pagina do hino precisa ser acessivel sem login.

**Decisao:** A rota `/flamengo` no React Router NAO e envolta em `ProtectedRoute`, pois o endpoint backend tambem e publico.

**Motivacao:** Consistencia entre acesso de API e acesso de interface — ambos publicos.
