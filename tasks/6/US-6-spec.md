# Spec — US-6: Create Comprehensive README Documentation

## Problema
O projeto nao possui documentacao adequada no arquivo README.md da raiz (atualmente contendo apenas "Init"). Desenvolvedores novos ou colaboradores externos nao conseguem entender a estrutura do projeto, instalar dependencias ou executar a aplicacao localmente sem orientacao.

## Objetivo
Produzir um README.md completo na raiz do repositorio que permita a qualquer desenvolvedor entender, configurar e executar a aplicacao fullstack (Laravel 11 + React/Vite) do zero.

## Requisitos Funcionais

1. O README.md deve conter titulo e descricao do projeto.
2. O README.md deve listar os pre-requisitos com versoes minimas exigidas: PHP 8.2+, Composer, Node.js e npm.
3. O README.md deve conter instrucoes passo a passo para configurar o backend Laravel (clonar, instalar dependencias via Composer, configurar .env, gerar chave da aplicacao, criar banco SQLite, executar migrations).
4. O README.md deve conter instrucoes passo a passo para configurar o frontend React + Vite (instalar dependencias via npm).
5. O README.md deve conter os comandos para executar o backend (php artisan serve) e o frontend (npm run dev) em modo desenvolvimento.
6. O README.md deve documentar o sistema de autenticacao baseado em Laravel Sanctum (registro, login, logout, rota protegida).
7. O README.md deve apresentar a estrutura de diretorios do projeto (backend/ e frontend/ com subpastas principais).
8. O README.md deve listar os endpoints de API disponiveis com metodo HTTP, caminho e descricao.
9. O README.md deve incluir uma secao de troubleshooting com problemas comuns e suas solucoes.
10. O README.md deve usar formatacao Markdown consistente (titulos hierarquicos, blocos de codigo com linguagem indicada, listas).

## Fluxo do Usuario

1. Desenvolvedor clona o repositorio.
2. Desenvolvedor abre o README.md na raiz.
3. Desenvolvedor le os pre-requisitos e verifica se seu ambiente esta adequado.
4. Desenvolvedor segue as instrucoes do backend, configura o .env e executa as migrations.
5. Desenvolvedor segue as instrucoes do frontend e instala as dependencias npm.
6. Desenvolvedor executa os dois servidores de desenvolvimento e acessa a aplicacao no navegador.

## Criterios de Aceitacao

- [ ] README.md contem titulo e descricao do projeto na secao inicial.
- [ ] README.md lista todos os pre-requisitos com versoes minimas: PHP 8.2+, Composer, Node.js, npm.
- [ ] README.md apresenta instrucoes completas de setup do backend Laravel (dependencias, .env, chave, SQLite, migrations).
- [ ] README.md apresenta instrucoes completas de setup do frontend React + Vite (dependencias npm).
- [ ] README.md informa os comandos para rodar backend (porta 8000) e frontend (porta 3000) em desenvolvimento.
- [ ] README.md documenta o sistema de autenticacao com Sanctum, incluindo os endpoints publicos e protegidos.
- [ ] README.md exibe a estrutura de diretorios do projeto.
- [ ] README.md lista os endpoints de API: POST /api/register, POST /api/login, POST /api/logout, GET /api/user.
- [ ] README.md contem secao de troubleshooting com ao menos 3 problemas comuns.
- [ ] Toda formatacao Markdown esta correta e consistente (headings, code blocks com linguagem, listas).

## Escopo Tecnico

- Backend necessario: nao
- Frontend necessario: nao

## Suposicoes

- O projeto nao possui nome proprio definido na issue; sera usado um nome generico descritivo (ex: "Fullstack App") a menos que haja outro indicativo no repositorio.
- A porta 8000 e do backend e a porta 3000 e do frontend, conforme configurado no vite.config.js (proxy para localhost:8000).
- O banco de dados utilizado e SQLite, localizado em backend/database/database.sqlite, conforme evidenciado pelo Dockerfile e pelos scripts do composer.json.
- O arquivo .env do backend e criado a partir de .env.example, conforme o Dockerfile.
- Nao ha Docker Compose documentado para o usuario final; as instrucoes serao para execucao local direta (sem Docker), pois o Dockerfile e para deploy e nao para desenvolvimento.
- O frontend se comunica com o backend via proxy configurado no Vite, nao sendo necessario configurar CORS manualmente no ambiente de desenvolvimento.

## Fora do Escopo

- Criacao ou alteracao de qualquer codigo-fonte (PHP, JavaScript, etc.).
- Documentacao de deploy em producao ou configuracao de servidor web (Nginx, Apache).
- Documentacao de testes automatizados (PHPUnit).
- Criacao de documentacao adicional alem do README.md raiz (ex: wiki, docs/).
- Alteracao do README.md interno do frontend (frontend/README.md).
