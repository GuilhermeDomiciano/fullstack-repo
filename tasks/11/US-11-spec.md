# Spec — US-11: Docker fix: failed to solve

## Problema

O build Docker do backend falha durante a execucao de `RUN composer dump-autoload --optimize`. O erro ocorre porque o script `post-autoload-dump` definido no `composer.json` tenta executar `@php artisan package:discover --ansi`, que requer um arquivo `.env` com `APP_KEY` definida e um ambiente Laravel minimamente inicializado. Nenhum desses pre-requisitos existe durante o build da imagem.

## Objetivo

Corrigir o backend `Dockerfile` para que o `composer dump-autoload --optimize` seja executado com sucesso durante o build, sem suprimir erros nem alterar o comportamento da aplicacao em runtime.

## Requisitos Funcionais

1. O comando `composer dump-autoload --optimize` deve ser executado sem falha durante o build Docker.
2. O script `post-autoload-dump` (`artisan package:discover`) NAO deve ser executado durante o build (deve ser suprimido apenas em build-time, nao em runtime).
3. Todas as dependencias PHP necessarias para o Laravel 11 devem estar instaladas na imagem Alpine antes de qualquer comando Composer.
4. Um arquivo `.env` minimo deve estar disponivel durante o build para que o Laravel consiga inicializar sem erros caso qualquer artisan seja chamado no build.
5. O build do frontend deve permanecer sem alteracoes e continuar funcionando.
6. Apos `docker-compose up --build`, o backend deve estar acessivel em `http://localhost:8000` e o frontend em `http://localhost:3000`.

## Fluxo do Usuario

1. Desenvolvedor executa `docker-compose up --build` na raiz do projeto.
2. O Docker constroi a imagem do backend: instala extensoes PHP, copia arquivos, instala dependencias e gera o autoloader sem erros.
3. O Docker constroi a imagem do frontend sem alteracoes.
4. Os containers sobem e a aplicacao fica acessivel nos dois endpoints.

## Criterios de Aceitacao

- [ ] `docker-compose up --build` conclui sem erros de exit code diferente de 0
- [ ] O passo `RUN composer dump-autoload --optimize` completa com sucesso no log do build
- [ ] O container `fusionrun_backend` sobe e responde em `http://localhost:8000/up` (ou `/api/health`)
- [ ] O container `fusionrun_frontend` sobe e responde em `http://localhost:3000`
- [ ] Nenhum erro e mascarado — a causa raiz e corrigida, nao ignorada com `|| true` ou flags de supressao
- [ ] O comportamento em runtime (migrations, key:generate, package:discover) permanece intacto via `docker-entrypoint.sh`

## Escopo Tecnico

- Backend necessario: sim (Dockerfile e possivelmente `.env.example`)
- Frontend necessario: nao

## Diagnostico da Causa Raiz

A causa raiz esta na interacao entre tres fatores no backend `Dockerfile` atual (`backend/Dockerfile`):

1. **Script `post-autoload-dump` no `composer.json`** — o `composer.json` define:
   ```json
   "post-autoload-dump": [
       "Illuminate\\Foundation\\ComposerScripts::postAutoloadDump",
       "@php artisan package:discover --ansi"
   ]
   ```
   O `artisan package:discover` requer que o Laravel bootstrape com sucesso, o que exige `APP_KEY` e `.env`.

2. **Ausencia de `.env` durante o build** — nao existe `.env` na imagem durante o build (so em runtime, via `docker-entrypoint.sh`). O Laravel falha ao tentar carregar configuracoes.

3. **`composer dump-autoload --optimize` sem `--no-scripts`** — o comando na linha 31 do Dockerfile atual NAO usa `--no-scripts`, portanto os scripts `post-autoload-dump` sao disparados e o `artisan package:discover` falha.

## Solucao Esperada (O QUE, nao COMO)

O `Dockerfile` do backend deve garantir que:

- O autoloader seja gerado sem executar scripts Artisan durante o build (evitar `artisan package:discover` no build-time).
- OU um `.env` minimo (copiado de `.env.example`) esteja presente durante o build para que o Laravel consiga inicializar caso algum artisan seja necessario em build-time.
- A ordem das instrucoes no Dockerfile respeite a dependencia entre copiar arquivos, instalar extensoes e gerar o autoloader.

As duas abordagens validas (a serem avaliadas pelo agente Plan/Execute):
1. Usar `--no-scripts` no `composer dump-autoload --optimize` (torna o build independente de `.env`).
2. Copiar `.env.example` como `.env` antes do dump-autoload e, se necessario, definir um `APP_KEY` dummy via `RUN` para que o artisan nao aborte.

A abordagem escolhida nao deve mascarar erros reais nem alterar o comportamento da aplicacao em producao/runtime.

## Suposicoes

- O erro e causado exclusivamente pela ausencia de `.env` / `APP_KEY` durante o build, e nao por extensoes PHP faltantes (as extensoes `pdo`, `pdo_sqlite`, `pdo_mysql`, `bcmath` ja estao instaladas e sao suficientes para o Laravel 11).
- Nao ha injecao de segredos reais necessaria durante o build; o `.env.example` contem valores suficientes para que o bootstrap do Laravel funcione em modo build.
- O `docker-entrypoint.sh` existente ja lida corretamente com o setup em runtime (`.env`, `key:generate`, migrations) e nao precisa ser alterado.

## Fora do Escopo

- Alteracoes no frontend Dockerfile
- Alteracoes no `docker-compose.yml`
- Alteracoes em configuracoes do Laravel (providers, services)
- Adicao de novas extensoes PHP (nao e a causa raiz)
- Mudancas no `docker-entrypoint.sh`
- Setup de banco de dados em producao ou ambientes nao-Docker
