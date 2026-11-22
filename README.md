# Controle de Faltas

Projeto Final da disciplina **C216 — Sistemas Distribuídos** (Inatel, 2026.2).

🎥 **Vídeo de demonstração:** _(link a ser adicionado)_

## Objetivo e tema

No Inatel, o aluno pode faltar no máximo uma porcentagem das aulas de cada disciplina
(normalmente 25%). Acompanhar isso de cabeça é fácil de errar, e passar do limite reprova
por falta.

O **Controle de Faltas** é uma aplicação web em que o aluno cadastra suas disciplinas,
registra as faltas por data e acompanha, para cada disciplina, quantas faltas já usou,
quantas ainda pode ter e se está em situação regular, em risco ou reprovado.

## Funcionalidades

- **Disciplinas (CRUD):** cadastrar, listar, consultar, editar e excluir, com nome,
  professor (opcional), total de aulas no semestre e porcentagem de faltas permitida.
- **Faltas (CRUD):** registrar, listar, editar e excluir faltas de cada disciplina, com
  data, indicação de falta justificada e observação.
- **Resumo calculado pela API** para cada disciplina: limite de faltas, faltas usadas,
  faltas restantes e situação, exibidos em cards com barra de progresso e cores.
- Estados de carregamento, lista vazia e erro na interface, com mensagens vindas da API.

### Regras de negócio

| Regra | Comportamento |
|---|---|
| Limite de faltas | `total de aulas × porcentagem ÷ 100`, arredondado para baixo (100 aulas com 25% → 25 faltas) |
| Valor de cada falta | Cada falta registrada vale **2**, pois há no máximo uma aula por dia de cada disciplina |
| Faltas justificadas | Não contam para o limite |
| Situação | **Regular** abaixo de 75% do limite; **Em risco** a partir de 75% até o limite; **Reprovado** acima do limite |
| Data da falta | Não pode ser no futuro (422) e não pode se repetir na mesma disciplina (409) |
| Nome da disciplina | Único, sem diferenciar maiúsculas e minúsculas (409) |
| Exclusão de disciplina | Remove também as faltas dela (cascata) |

Exemplo: com 100 aulas e 25%, o limite é 25. Faltando 12 dias, são 24 faltas (em risco);
no 13º dia, 26 faltas (reprovado).

## Tecnologias

| Parte | Tecnologias |
|---|---|
| Backend | Python 3.13, FastAPI, Pydantic, SQLAlchemy 2, Alembic, Poetry |
| Banco de dados | PostgreSQL 16 |
| Frontend | React 19, Vite, Tailwind CSS |
| Qualidade | Ruff (backend), Biome (frontend) |
| Testes | Pytest + httpx, Vitest + Testing Library, Playwright (E2E) |
| Infraestrutura | Docker, Docker Compose, Makefile, GitHub Actions |

## Arquitetura

```
Navegador (React, porta 5173)  ──HTTP/JSON──>  API FastAPI (porta 8000)  ──SQL──>  PostgreSQL
```

O `docker-compose.yml` sobe três serviços na mesma rede: `db` (PostgreSQL), `api`
(FastAPI) e `web` (Vite/React). A `api` só inicia depois que o `db` está saudável, e o
`web` depois que a `api` responde em `/health`. O CORS da API libera apenas a origem do
frontend e os métodos usados (GET, POST, PUT, DELETE).

O backend é organizado em camadas:

- **routes:** recebem as requisições HTTP e convertem as exceções dos serviços em 404/409;
- **services:** regras de negócio (o cálculo de faltas fica em `services/attendance.py`);
- **repositories:** únicos responsáveis por acessar o banco;
- **models:** tabelas do SQLAlchemy;
- **schemas:** validação de entrada e formato de saída com Pydantic.

## Estrutura resumida

```
.
├── backend/
│   ├── alembic/versions/      # migrações do banco
│   ├── app/
│   │   ├── api/routes/        # subjects, absences, health
│   │   ├── core/config.py     # variáveis de ambiente
│   │   ├── database/          # engine, sessão e Base
│   │   ├── models/            # SubjectModel, AbsenceModel
│   │   ├── repositories/
│   │   ├── schemas/
│   │   ├── services/          # regras de negócio e cálculo de faltas
│   │   └── main.py            # app FastAPI + CORS
│   ├── tests/                 # unit/ e integration/ (Pytest)
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/        # cards, formulários, lista de faltas
│   │   ├── pages/             # lista de disciplinas e detalhe da disciplina
│   │   ├── services/          # chamadas HTTP à API
│   │   └── utils/             # situação e datas
│   ├── tests/e2e/             # Playwright
│   └── Dockerfile
├── .github/workflows/         # ci-backend.yml e ci-frontend.yml
├── docker-compose.yml
├── Makefile
├── .env.example
└── .env.e2e                   # portas da stack isolada usada no E2E
```

## Pré-requisitos

- **Docker** e **Docker Compose** (para rodar a aplicação)
- **Make**
- Para rodar testes e lint fora do Docker:
  - **Python 3.13** e **Poetry** (backend)
  - **Node.js 24** e npm (frontend)

## Variáveis de ambiente

Todas têm valor padrão no `docker-compose.yml`, então o `.env` é opcional. Para
personalizar, copie o exemplo e edite:

```bash
cp .env.example .env
```

| Variável | Padrão | Descrição |
|---|---|---|
| `POSTGRES_USER` | `faltas` | Usuário do PostgreSQL |
| `POSTGRES_PASSWORD` | `faltas` | Senha do PostgreSQL |
| `POSTGRES_DB` | `faltas` | Nome do banco |
| `DB_PORT` | `15432` | Porta do PostgreSQL no host |
| `API_PORT` | `8000` | Porta da API no host |
| `WEB_PORT` | `5173` | Porta do frontend no host |
| `VITE_API_URL` | `http://localhost:8000` | Endereço da API usado pelo navegador |
| `CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Origens liberadas no CORS (separadas por vírgula) |

O `.env` não é versionado.

## Como executar

```bash
make up-build     # constrói as imagens e sobe db, api e web
make db-upgrade   # aplica as migrações (cria as tabelas)
```

Depois, acesse:

- **Aplicação:** http://localhost:5173
- **API:** http://localhost:8000
- **Documentação da API (Swagger):** http://localhost:8000/docs

Outros comandos:

```bash
make ps       # status dos containers
make logs     # logs de todos os serviços
make down     # derruba os containers (os dados ficam no volume)
make up       # sobe de novo sem reconstruir as imagens
```

## Migrações

As migrações ficam em `backend/alembic/versions` e rodam dentro do container da API:

```bash
make db-upgrade   # alembic upgrade head
make db-current   # mostra a migração atual
make db-shell     # abre o psql no banco (ex.: SELECT * FROM subjects;)
```

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | `/health` | Verificação de saúde |
| GET | `/subjects/` | Lista disciplinas com o resumo de faltas |
| POST | `/subjects/` | Cria disciplina |
| GET | `/subjects/{id}` | Consulta uma disciplina |
| PUT | `/subjects/{id}` | Atualiza disciplina |
| DELETE | `/subjects/{id}` | Exclui disciplina e suas faltas |
| GET | `/subjects/{id}/absences` | Lista faltas da disciplina (mais recentes primeiro) |
| POST | `/subjects/{id}/absences` | Registra falta |
| PUT | `/absences/{id}` | Atualiza falta |
| DELETE | `/absences/{id}` | Exclui falta |

## Testes

Instale as dependências uma vez:

```bash
make install       # backend (Poetry)
make fe-install    # frontend (npm)
make e2e-install   # navegador Chromium do Playwright
```

| Comando | O que roda |
|---|---|
| `make test` | Pytest: regras de negócio (unitários) e endpoints (integração, com SQLite em memória) |
| `make lint` / `make format-check` | Ruff no backend |
| `make fe-test` | Vitest + Testing Library: utilitários, camada de API, componentes e página |
| `make fe-lint` | Biome no frontend (lint e formatação) |
| `make fe-build` | Build de produção do frontend |
| `make e2e` | Playwright contra a stack real numa stack Docker isolada (`controle-faltas-e2e`, portas do `.env.e2e`), removida ao final |
| `make check-all` | Todos os itens acima em sequência |

`make help` lista todos os comandos.

## Integração contínua

Os workflows do GitHub Actions rodam em push e em pull request:

- **CI Backend** (`ci-backend.yml`): Ruff (lint e formatação) e Pytest.
- **CI - Frontend** (`ci-frontend.yml`): Biome, Vitest, build e o E2E com Playwright
  subindo a stack completa com Docker Compose.
