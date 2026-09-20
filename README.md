# C216-L1-
Esse repositório foi alocado para a disciplina do laboratório de Sistemas Distribuídos

## Testes

Os testes do backend ficam em `backend/tests` e usam `pytest`.

Rodando localmente (com Poetry já instalado):

```bash
make test
```

Isso equivale a `poetry --directory backend run pytest tests -v`.

Também é possível rodar direto de dentro de `backend/`:

```bash
cd backend
poetry install
poetry run pytest tests -v
```

Os testes são executados automaticamente pelo GitHub Actions (`.github/workflows/ci-backend.yml`) em todo `push` e `pull_request`.
