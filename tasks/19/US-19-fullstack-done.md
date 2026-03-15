# US-19 Fullstack Done

## Resumo

Implementacao do endpoint que retorna o hino do Flamengo em JSON e da pagina frontend que exibe a letra.

---

## Backend

### Endpoint implementado

| Metodo | Rota               | Autenticacao | Descricao                          |
|--------|--------------------|--------------|------------------------------------|
| GET    | /api/hino/flamengo | Nenhuma      | Retorna o hino do Flamengo em JSON |

### Formato da resposta

```json
{
  "clube": "Flamengo",
  "titulo": "Hino do Flamengo",
  "compositor": "Lamartine Babo",
  "estrofes": [
    {
      "versos": ["Uma vez Flamengo,", "Sempre Flamengo,", "Flamengo sempre eu hei de ser."]
    },
    ...
  ]
}
```

### Arquivos criados/modificados (backend)

- **Criado:** `backend/app/Http/Controllers/HinoController.php`
  - Metodo `flamengo()` retorna JSON com titulo, compositor e todas as estrofes do hino.
- **Modificado:** `backend/routes/api.php`
  - Adicionado `use App\Http\Controllers\HinoController;`
  - Adicionada rota publica `Route::get('/hino/flamengo', [HinoController::class, 'flamengo']);`

---

## Frontend

### Pagina implementada

| Rota            | Componente          | Protegida | Descricao                                    |
|-----------------|---------------------|-----------|----------------------------------------------|
| /hino/flamengo  | HinoFlamengoPage    | Sim       | Exibe a letra completa do hino do Flamengo   |

### Arquivos criados/modificados (frontend)

- **Criado:** `frontend/src/api/hinoApi.js`
  - Exporta `getHinoFlamengo()` que chama `GET /api/hino/flamengo`.
- **Criado:** `frontend/src/pages/HinoFlamengoPage.jsx`
  - Carrega o hino via `useEffect`, exibe titulo, compositor e todas as estrofes.
  - Exibe estado de loading, erro e conteudo.
- **Modificado:** `frontend/src/App.jsx`
  - Importado `HinoFlamengoPage`.
  - Adicionada rota protegida `/hino/flamengo`.
- **Modificado:** `frontend/src/index.css`
  - Adicionadas classes: `.hino-page`, `.hino-main`, `.hino-card`, `.hino-header`, `.hino-title`, `.hino-compositor`, `.hino-letra`, `.hino-estrofe`.
