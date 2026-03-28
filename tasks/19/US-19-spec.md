# US-19 — Endpoint Flamengo

## Contexto

O sistema necessita de um endpoint REST que retorne a letra do Hino do Flamengo. Este será um exemplo de integração backend-frontend, demonstrando a comunicação entre API REST (Laravel) e cliente (React) através de requisições HTTP.

## História de Usuário

```
Como usuário,
quero visualizar a letra do Hino do Flamengo,
para aprender e consultar a letra do hino.
```

## Critérios de Aceitação

1. **Endpoint backend criado**
   - Deve existir uma rota GET `/api/flamengo` que retorna a letra do hino
   - A resposta deve ser um JSON com a estrutura: `{ "nome": "Hino do Flamengo", "letra": "..." }`
   - Endpoint deve estar documentado e funcionar sem autenticação (público)

2. **Frontend exibe o hino**
   - Uma nova página ou componente deve exibir a resposta do endpoint
   - A letra do hino deve ser renderizada de forma legível (com quebras de linha preservadas)
   - A página deve indicar o título "Hino do Flamengo" claramente

3. **Integração correta**
   - Frontend deve fazer requisição HTTP para `GET /api/flamengo`
   - A chamada HTTP deve estar centralizada em `src/api/`
   - Não deve haver requisições Axios instanciadas diretamente em componentes

4. **Tratamento de erros básico**
   - Se o endpoint falhar, exibir mensagem de erro apropriada
   - Validar que a resposta contém os dados esperados

## Notas Técnicas

- **Backend**: Criar um novo Controller (ex: `FlamengController`) com um método que retorna a letra do hino
- **Rota**: Adicionar rota pública em `backend/routes/api.php`
- **Frontend**:
  - Adicionar função em `src/api/` para consumir o endpoint
  - Criar página em `src/pages/` (ex: `Flamengo.jsx`)
  - Adicionar rota em `App.jsx` (ex: `/flamengo`)
- **Letra do hino**: Use a versão completa e correta do Hino do Flamengo de Lamartine Babo
- Sem over-engineering: implementação simples e direta, sem complexidade desnecessária

## Critérios de Teste (QA)

### API

- **GET /api/flamengo sem autenticação**
  - Deve retornar status 200
  - Response deve conter `nome` e `letra`
  - A letra deve estar completa e corrigida

- **Validação de resposta**
  - Campo `nome` deve ser string: "Hino do Flamengo"
  - Campo `letra` deve ser string com múltiplas linhas

### E2E

- **Navegação até a página do hino**
  - Acesso a `/flamengo` deve carregar a página com sucesso

- **Exibição do conteúdo**
  - Página deve mostrar o título "Hino do Flamengo"
  - Toda a letra do hino deve estar visível
  - Quebras de linha devem ser preservadas (não ser um bloco de texto contínuo)

- **Comportamento da requisição**
  - Requisição HTTP deve ser feita automaticamente ao carregar a página
  - Não deve haver erros no console do navegador

## Referência de Dados

A letra do Hino do Flamengo (Lamartine Babo) deve conter:

```
Meu Flamengo lindo e valente,
Flamengo do meu coração,
Tu és a gloria do Brasil,
Salve Salve Flamengo...
[continuar com a letra completa]
```

(Use a versão íntegra e historicamente correta da letra)

## Fora do Escopo

- Criar tabelas ou modelos de banco de dados para armazenar o hino (pode ser hardcoded)
- Autenticação para acessar o endpoint
- Múltiplos idiomas ou versões alternativas do hino
- Integração com players de áudio ou sistema de reprodução
- Testes unitários ou E2E automatizados (será responsabilidade do QA manual)
