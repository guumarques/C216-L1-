# C216-L1-
Esse repositório foi alocado para a disciplina do laboratório de Sistemas Distribuídos

Cadastro de usuários (nome + e-mail) com:

- **backend/**: FastAPI + SQLAlchemy + Alembic (PostgreSQL), rotas `GET/POST /users/` e `GET/PUT/PATCH/DELETE /users/{id}`
- **frontend/**: React + Vite + Tailwind, consumindo a API via `fetch` (`src/services/users.js`)
- **compose.yml**: três serviços — `db`, `api` e `frontend`

## Subindo tudo com Docker

```bash
make up-build     # sobe db, api e frontend (espera todos ficarem healthy)
make db-upgrade   # aplica as migrations
make ps           # status dos containers
```

- Frontend: http://localhost:5173
- API (Swagger): http://localhost:8000/docs

Para trocar portas ou origens, copie `.env.example` para `.env` e ajuste. O CORS da API só libera as origens listadas em `CORS_ORIGINS`.

## Testes

| Comando | O que roda |
|---|---|
| `make test` | Pytest do backend (SQLite em memória) |
| `make lint` | Ruff no backend |
| `make frontend-test` | Vitest (unitários e integração, com `fetch` mockado) |
| `make frontend-check` | Biome |
| `make frontend-build` | Build do Vite |
| `make e2e` | Playwright contra uma stack isolada (`lab-e2e`), removida ao final |
| `make check-all` | Tudo acima |

Antes do primeiro `make e2e`, instale o navegador do Playwright com `make e2e-install`.

Os testes também rodam no GitHub Actions (`.github/workflows/ci-backend.yml` e `ci-frontend.yml`).
