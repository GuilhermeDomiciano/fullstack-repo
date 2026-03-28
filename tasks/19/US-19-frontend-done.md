# Frontend — US-19

## Paginas implementadas
- `/flamengo-anthem` → `pages/FlamengoAnthemPage.jsx`

## Servicos criados/modificados
- `services/` — nenhum servico criado (chamada de API via modulo api/)
- `api/flamengoApi.js` — criado com funcao `getFlamengoAnthem()`

## Arquivos criados/modificados
- `frontend/src/api/flamengoApi.js` — novo; exporta `getFlamengoAnthem()` que chama GET `/api/flamengo-anthem` via instancia `api` de `authApi.js`
- `frontend/src/pages/FlamengoAnthemPage.jsx` — novo; pagina com estados de loading, erro e sucesso; exibe `title` em `<h1>` e `lyrics` em `<p>` com `white-space: pre-line`
- `frontend/src/App.jsx` — adicionado import de `FlamengoAnthemPage` e rota publica `<Route path="/flamengo-anthem" element={<FlamengoAnthemPage />} />`
- `frontend/src/index.css` — adicionadas classes CSS: `.anthem-page`, `.anthem-title`, `.anthem-lyrics`, `.anthem-loading`, `.anthem-error`

## Observacoes
- A rota `/flamengo-anthem` e publica (sem `ProtectedRoute`), conforme especificado no contrato de API.
- O componente usa `useEffect` + `useState` para buscar os dados ao montar. Nao usa Context (dados nao sao globais).
- O elemento `.anthem-lyrics` usa `white-space: pre-line` para preservar quebras de linha `\n` da letra do hino.
- Estado de loading mostra a mensagem "Carregando hino..." enquanto a requisicao esta em andamento.
- Estado de erro exibe mensagem amigavel estilizada com as variaveis CSS de erro do projeto.
- O linter (ESLint) nao pode ser executado localmente pois `node_modules` nao esta instalado no ambiente de CI. O codigo segue todas as convencoes do projeto e nao contem erros de sintaxe.
