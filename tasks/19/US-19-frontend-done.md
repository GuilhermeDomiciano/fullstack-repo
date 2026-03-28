# Frontend — US-19

## Paginas implementadas
- `/flamengo` → `pages/FlamengoPage.jsx`

## Servicos criados/modificados
- `services/` — nenhum servico criado (logica simples, sem necessidade de service layer)

## Arquivos criados/modificados
- `frontend/src/api/flamengoApi.js` — criado (exporta `getFlamengo()` usando a instancia axios de `authApi.js`)
- `frontend/src/pages/FlamengoPage.jsx` — criado (pagina que busca e exibe o hino)
- `frontend/src/App.jsx` — modificado (adicionada rota publica `/flamengo` e import do componente)
- `frontend/src/index.css` — modificado (adicionados estilos `.flamengo-page`, `.flamengo-title`, `.flamengo-letra`, `.flamengo-loading`, `.flamengo-error`)

## Observacoes
- A rota `/flamengo` e publica (sem `ProtectedRoute`), adicionada antes da rota catch-all `path="*"`
- `FlamengoPage.jsx` chama `getFlamengo()` dentro de `useEffect` ao montar o componente
- Estado de carregamento exibido enquanto a requisicao esta em andamento
- Erros de rede/API exibidos com estilo de erro visual (classes CSS de erro existentes)
- A letra e renderizada com `white-space: pre-line` via CSS para preservar as quebras de linha (`\n`) retornadas pelo backend
- `getFlamengo()` usa a instancia axios exportada por `authApi.js` (interceptor de token Bearer), conforme convencao do projeto
- O lint nao pde ser executado porque `node_modules` nao esta instalado no ambiente de CI — o erro e pre-existente e nao relacionado a esta US
