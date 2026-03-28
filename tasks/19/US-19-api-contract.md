# API Contract — US-19

## Agentes necessarios
- backend: sim
- frontend: sim

---

## Endpoints

### GET /api/flamengo-anthem

- **Descricao:** Retorna o titulo e a letra do hino do Flamengo. Rota publica, sem autenticacao.
- **Body:** N/A
- **Resposta 200:**
  ```json
  {
    "title": "Hino do Flamengo",
    "lyrics": "<letra completa do hino, com quebras de linha representadas por \\n>"
  }
  ```
- **Resposta 5XX (erro inesperado de servidor):**
  ```json
  {
    "error": "Servico indisponivel"
  }
  ```

Nao ha respostas 4XX esperadas para este endpoint: ele nao recebe parametros de entrada e nao requer autenticacao.

---

## Dados em memoria

Os dados do hino sao hardcoded no controller (sem banco de dados, conforme escopo da historia). Estrutura logica:

```
anthem = {
  title: string   // "Hino do Flamengo"
  lyrics: string  // Letra completa, linhas separadas por \n
}
```

---

## Plano de implementacao — Backend (Laravel)

### Arquivo: `backend/routes/api.php`

Adicionar a rota publica abaixo dos grupos existentes (fora de qualquer middleware):

```php
Route::get('/flamengo-anthem', [FlamengoAnthemController::class, 'show']);
```

### Arquivo: `backend/app/Http/Controllers/FlamengoAnthemController.php`

Criar controller simples (sem Resource, pois ha apenas uma acao):

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class FlamengoAnthemController extends Controller
{
    public function show(): JsonResponse
    {
        return response()->json([
            'title'  => 'Hino do Flamengo',
            'lyrics' => implode("\n", [
                'Uma vez Flamengo, Flamengo sempre, eu',
                'Flamengo filho, Flamengo tambem serei',
                // ... letra completa aqui
            ]),
        ]);
    }
}
```

O Dev Backend deve usar a letra autentica do hino de Lamartine Babo (conforme validado na US-17).

### Arquivo: `backend/tests/Feature/FlamengoAnthemTest.php`

Testes PHPUnit a cobrir:
1. GET /api/flamengo-anthem retorna HTTP 200
2. Response Content-Type e `application/json`
3. JSON contem chave `title` do tipo string nao vazia
4. JSON contem chave `lyrics` do tipo string nao vazia
5. Endpoint e acessivel sem token de autenticacao (sem header `Authorization`)

---

## Plano de implementacao — Frontend (React)

### Arquivo: `frontend/src/api/flamengoApi.js`

Criar modulo de API seguindo o padrao de `workspaceApi.js` (importa a instancia `api` de `authApi.js`):

```js
import api from './authApi';

export const getFlamengoAnthem = () => api.get('/api/flamengo-anthem');
```

### Arquivo: `frontend/src/pages/FlamengoAnthemPage.jsx`

Pagina dedicada com tres estados:
- **loading:** exibir mensagem/spinner enquanto a requisicao esta em andamento
- **error:** exibir mensagem de erro amigavel se a requisicao falhar
- **success:** exibir `title` em destaque (h1 ou similar) e `lyrics` preservando quebras de linha (`white-space: pre-line` ou `<pre>`)

Usar `useEffect` + `useState`; nao usar Context (dados nao sao globais).

### Arquivo: `frontend/src/App.jsx`

Adicionar rota publica (sem `ProtectedRoute`):

```jsx
import FlamengoAnthemPage from './pages/FlamengoAnthemPage';

// dentro de <Routes>:
<Route path="/flamengo-anthem" element={<FlamengoAnthemPage />} />
```

---

## Abordagem de testes

### Backend (PHPUnit)
- Arquivo: `tests/Feature/FlamengoAnthemTest.php`
- Classe: `FlamengoAnthemTest extends TestCase`
- Nao requer database (dados hardcoded), portanto sem `RefreshDatabase`
- Usar `$this->getJson('/api/flamengo-anthem')` e encadear `->assertOk()->assertJsonStructure(['title', 'lyrics'])`

### Frontend (manual / E2E)
- Navegar para `/flamengo-anthem`
- Verificar que o estado de loading aparece brevemente
- Verificar que titulo e letra sao exibidos apos carregamento
- Simular falha de rede (DevTools > Network offline) e verificar mensagem de erro

---

## Observacoes

1. **Sem banco de dados:** a letra e retornada como dado estatico no controller. Nao criar migration, model ou seeder.
2. **Sem autenticacao:** a rota deve ficar fora dos grupos `middleware('auth:sanctum')` e `middleware('throttle:6,1')`.
3. **Axios compartilhado:** o modulo `flamengoApi.js` reutiliza a instancia `api` de `authApi.js`; o interceptor de token ja esta configurado la, mas nao enviara token para esta rota se o usuario nao estiver logado — isso e o comportamento correto.
4. **Rota frontend publica:** `FlamengoAnthemPage` nao deve ser envolvida em `ProtectedRoute`, pois a historia exige acesso publico.
5. **Letra autentica:** o Dev Backend deve usar a letra correta do hino de Lamartine Babo, conforme estabelecido na US-17 (fix da letra). Consultar `tasks/17/` se necessario.
6. **white-space na exibicao:** a letra contem quebras de linha; o componente deve garantir que elas sejam renderizadas (usar CSS `white-space: pre-line` no elemento que exibe `lyrics`).
