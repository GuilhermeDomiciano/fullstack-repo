US-19 — Endpoint Flamengo
==========================

CONTEXTO
--------
O sistema precisa de um endpoint no backend que retorne o hino do Flamengo, e um frontend que consuma esse endpoint para exibir o hino na tela.

HISTORIA
--------
Como usuário do sistema,
quero visualizar o hino do Flamengo,
para ter acesso ao conteúdo cultural do clube.

CRITERIOS DE ACEITACAO
-----------------------
1. Backend expõe um endpoint GET `/api/flamengo-anthem` que retorna o hino do Flamengo
2. O endpoint retorna um JSON com a estrutura: `{ "title": "string", "lyrics": "string" }`
3. O endpoint é acessível publicamente (sem autenticação)
4. Frontend consome o endpoint e exibe o hino em uma página dedicada
5. A página exibe o título e letra do hino de forma legível
6. O loading state é mostrado enquanto carrega os dados
7. Tratamento de erro é implementado caso o endpoint falhe

REGRAS TECNICAS
---------------
- Backend: Laravel Route Resource em `routes/api.php`
- Frontend: Componente em `src/pages/` ou `src/components/` que consome via Axios
- Usar `src/api/` para abstrair chamada HTTP
- Sem autenticação obrigatória (rota pública)
- Axios configurado via variável `VITE_API_URL`
- Sem over-engineering; manter simples

CRITERIOS DE TESTE (QA)
------------------------
API:
  - GET /api/flamengo-anthem retorna status 200
  - Response contém campos "title" e "lyrics"
  - Dados retornados estão corretos (hino autêntico)

E2E:
  - Página carrega sem erros
  - Hino é exibido completamente na tela
  - Loading spinner/mensagem aparece durante requisição
  - Erro é tratado graciosamente se requisição falhar

FORA DO ESCOPO
--------------
- Autenticação/autorização
- Edição ou modificação do hino
- Armazenamento em banco de dados (pode ser hardcoded ou fixture)
- Internacionalização
