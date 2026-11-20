.PHONY: help install test lint format format-check run

BACKEND := backend
POETRY := poetry --directory $(BACKEND)

PYTEST := $(POETRY) run pytest
UVICORN := $(POETRY) run uvicorn
RUFF := $(POETRY) run ruff

help:
	@echo "Backend:"
	@echo "  install          Instala as dependencias do backend (Poetry)"
	@echo "  test             Roda os testes do backend (Pytest)"
	@echo "  lint             Verifica o codigo com Ruff"
	@echo "  format           Formata o codigo com Ruff"
	@echo "  format-check     Confere a formatacao sem alterar arquivos"
	@echo "  run              Sobe a API localmente com reload"

# ---------- Backend ----------
install:
	$(POETRY) install

test:
	$(PYTEST) tests -v

lint:
	$(RUFF) check .

format:
	$(RUFF) format .

format-check:
	$(RUFF) format --check .

run:
	$(UVICORN) app.main:app --reload
