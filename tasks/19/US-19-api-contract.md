# API Contract — US-19

## Agentes necessarios
- backend: sim
- frontend: sim

---

## Endpoints

### GET /api/flamengo

- **Descricao:** Retorna a letra completa do Hino do Flamengo (Lamartine Babo). Endpoint publico, sem autenticacao.
- **Auth:** Nenhuma (fora do middleware `auth:sanctum`)
- **Body:** N/A
- **Resposta 200:**
```json
{
  "nome": "Hino do Flamengo",
  "letra": "Meu Flamengo lindo e valente,\nFlamengo do meu coração,\n..."
}
```
- **Resposta 5XX (falha inesperada):**
```json
{
  "error": "Erro interno do servidor."
}
```

---

## Dados em memoria

O hino e retornado como string hardcoded no controller. Nao ha banco de dados ou model envolvido. A letra e a versao completa e historicamente correta de Lamartine Babo, com quebras de linha representadas por `\n` dentro da string JSON.

Estrutura da resposta:
```
{
  nome: string   // "Hino do Flamengo"
  letra: string  // texto completo com \n para quebras de linha
}
```

---

## Plano de implementacao — Backend

**Arquivo a criar:**
- `backend/app/Http/Controllers/FlamengoController.php`

**Estrutura do controller:**
```php
namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class FlamengoController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'nome'  => 'Hino do Flamengo',
            'letra' => "<letra completa com \n>",
        ]);
    }
}
```

**Arquivo a modificar:**
- `backend/routes/api.php`

Adicionar FORA de qualquer grupo de middleware (rota publica), apos os comentarios de cabecalho:
```php
use App\Http\Controllers\FlamengoController;

Route::get('/flamengo', [FlamengoController::class, 'index']);
```

**Nao e necessario:**
- Migration, Model, FormRequest ou Resource — dados sao hardcoded
- Middleware de autenticacao
- Testes PHPUnit (fora do escopo desta US)

---

## Plano de implementacao — Frontend

**Arquivo a criar:**
- `frontend/src/api/flamengoApi.js`

Estrutura:
```js
import api from './authApi';

export const getFlamengo = () => api.get('/api/flamengo');
```

O interceptor existente em `authApi.js` adiciona o token Bearer automaticamente quando disponivel, mas o endpoint nao exige autenticacao — portanto funcionara com ou sem token.

**Arquivo a criar:**
- `frontend/src/pages/FlamengoPage.jsx`

Comportamento esperado:
- Chama `getFlamengo()` no `useEffect` ao montar o componente
- Exibe um estado de carregamento enquanto aguarda a resposta
- Renderiza `data.nome` como titulo (`<h1>`)
- Renderiza `data.letra` preservando quebras de linha (usar `white-space: pre-line` via CSS ou `<pre>` tag)
- Exibe mensagem de erro legivel se a requisicao falhar

**Arquivo a modificar:**
- `frontend/src/App.jsx`

Adicionar import e rota publica (sem `ProtectedRoute`):
```jsx
import FlamengoPage from './pages/FlamengoPage';

// Dentro de <Routes>, na secao de rotas publicas:
<Route path="/flamengo" element={<FlamengoPage />} />
```

A rota `/flamengo` deve ser adicionada ANTES da rota catch-all `path="*"`.

---

## Contrato de integracao

| Contrato        | Valor                          |
|-----------------|--------------------------------|
| Metodo          | GET                            |
| URL             | `/api/flamengo`                |
| Content-Type    | `application/json`             |
| Autenticacao    | Nenhuma                        |
| Campo `nome`    | string, valor fixo             |
| Campo `letra`   | string, quebras com `\n`       |
| Status sucesso  | 200                            |
| Status erro     | 500 (sem body customizado)     |

---

## Observacoes

1. O endpoint e inteiramente publico — nao deve ser adicionado dentro de nenhum grupo `middleware('auth:sanctum')` ou `middleware('throttle:...')`.
2. A letra deve ser hardcoded no controller (sem banco de dados), conforme explicitamente definido no escopo da US.
3. O Frontend deve usar o axios instance exportado por `authApi.js` (padrao `import api from './authApi'`), nunca instanciar axios diretamente no componente ou na pagina.
4. A preservacao das quebras de linha no frontend depende de CSS (`white-space: pre-line`) ou do elemento `<pre>` — o backend entrega `\n` literais na string JSON.
5. Nenhuma rota nova no frontend requer `ProtectedRoute`, pois o endpoint e publico.
