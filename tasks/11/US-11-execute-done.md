# Execute Done — US-11

## Arquivos criados/modificados
- `backend/Dockerfile` — adicionado flag `--no-scripts` ao comando `composer dump-autoload --optimize` na linha 31

## Endpoints implementados
- Nenhum (correcao de infraestrutura, sem novos endpoints)

## Componentes implementados
- Nenhum (correcao de infraestrutura, sem novos componentes frontend)

## Causa Raiz
O comando `RUN composer dump-autoload --optimize` na linha 31 do `backend/Dockerfile` disparava os scripts `post-autoload-dump` definidos no `composer.json`, incluindo `@php artisan package:discover --ansi`. Esse comando artisan requer que o Laravel bootstrape com sucesso, o que exige a presenca de um arquivo `.env` com `APP_KEY` definida. Como o `.env` nao existe durante o build da imagem Docker (apenas em runtime, via `docker-entrypoint.sh`), o processo falhava com exit code 1.

## Solucao Implementada
Adicionado o flag `--no-scripts` ao comando `composer dump-autoload` no `backend/Dockerfile`:

```dockerfile
# Antes
RUN composer dump-autoload --optimize

# Depois
RUN composer dump-autoload --optimize --no-scripts
```

O flag `--no-scripts` impede que o Composer execute os scripts `post-autoload-dump` durante o build-time, eliminando a dependencia de `.env` e `APP_KEY` no momento da construcao da imagem. O comportamento em runtime (package:discover, key:generate, migrations) permanece intacto via `docker-entrypoint.sh`.

## Observacoes
- A abordagem escolhida (Abordagem 1 do spec) e a mais limpa: nao copia segredos para a imagem e nao requer `.env` dummy durante o build.
- O `docker-entrypoint.sh` nao foi alterado, pois ja lida corretamente com o setup em runtime.
- O `docker-compose.yml` e o frontend Dockerfile nao foram alterados, conforme escopo definido no spec.
- Nenhum erro foi mascarado — a causa raiz foi corrigida diretamente.
