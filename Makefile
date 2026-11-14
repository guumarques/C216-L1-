.PHONY: help install test lint format run clean \
	up up-build down ps logs restart db-upgrade db-current db-shell \
	frontend-install frontend-dev frontend-lint frontend-format frontend-check frontend-test frontend-build \
	e2e-install e2e e2e-up e2e-test e2e-down check-all

BACKEND := backend
POETRY := poetry --directory $(BACKEND)

PYTHON := $(POETRY) run python
PYTEST := $(POETRY) run pytest
UVICORN := $(POETRY) run uvicorn
RUFF := $(POETRY) run ruff

FRONTEND := frontend
NPM := npm --prefix $(FRONTEND)

DC := docker compose
# Stack isolada para o E2E: outro nome de projeto, outras portas e volume próprio.
DC_E2E := docker compose -p lab-e2e --env-file .env.e2e
E2E_BASE_URL := http://localhost:15173

POSTGRES_USER ?= aula5
POSTGRES_DB ?= aula5

help:
	@echo "Backend:"
	@echo "  install          Instala as dependencias do backend (Poetry)"
	@echo "  test             Roda os testes do backend (Pytest)"
	@echo "  lint / format    Ruff (lint / formatacao)"
	@echo "  run              Sobe a API localmente com reload"
	@echo "Docker:"
	@echo "  up / up-build    Sobe db, api e frontend (up-build reconstroi as imagens)"
	@echo "  down             Derruba os containers"
	@echo "  ps / logs        Status / logs dos containers"
	@echo "  db-upgrade       Aplica as migrations (alembic upgrade head)"
	@echo "  db-current       Mostra a migration atual do banco"
	@echo "  db-shell         Abre o psql dentro do container do banco"
	@echo "Frontend:"
	@echo "  frontend-install Instala as dependencias do frontend"
	@echo "  frontend-dev     Servidor de desenvolvimento do Vite"
	@echo "  frontend-check   Biome (lint + formatacao, sem alterar arquivos)"
	@echo "  frontend-test    Vitest (unitarios e integracao)"
	@echo "  frontend-build   Build de producao do Vite"
	@echo "E2E:"
	@echo "  e2e-install      Instala o Chromium do Playwright"
	@echo "  e2e              E2E full-stack numa stack isolada (lab-e2e), removida ao final"
	@echo "Tudo:"
	@echo "  check-all        lint, test, frontend-check, frontend-test, frontend-build e e2e"

# ---------- Backend ----------
install:
	$(POETRY) install

test:
	$(PYTEST) tests -v

lint:
	$(RUFF) check .

format:
	$(RUFF) format .

run:
	$(UVICORN) app.main:app --reload

clean:
	rm -rf __pycache__ .pytest_cache .ruff_cache

# ---------- Docker ----------
up:
	$(DC) up -d --wait

up-build:
	$(DC) up -d --build --wait

down:
	$(DC) down

ps:
	$(DC) ps

logs:
	$(DC) logs -f

restart:
	$(DC) restart

db-upgrade:
	$(DC) exec api alembic upgrade head

db-current:
	$(DC) exec api alembic current

db-shell:
	$(DC) exec db psql -U $(POSTGRES_USER) -d $(POSTGRES_DB)

# ---------- Frontend ----------
frontend-install:
	$(NPM) ci

frontend-dev:
	$(NPM) run dev

frontend-lint:
	$(NPM) run lint

frontend-format:
	$(NPM) run format

frontend-check:
	$(NPM) run check

frontend-test:
	$(NPM) run test

frontend-build:
	$(NPM) run build

# ---------- E2E ----------
e2e-install:
	npx --prefix $(FRONTEND) playwright install chromium

# Sobe a stack isolada, roda o Playwright e derruba tudo (inclusive o volume),
# mesmo quando algum passo falha.
e2e:
	$(MAKE) e2e-up || ($(MAKE) e2e-down && exit 1)
	$(MAKE) e2e-test || ($(MAKE) e2e-down && exit 1)
	$(MAKE) e2e-down

e2e-up:
	$(DC_E2E) up -d --build --wait
	$(DC_E2E) exec -T api alembic upgrade head

e2e-test: export E2E_BASE_URL := $(E2E_BASE_URL)
e2e-test:
	$(NPM) run test:e2e

e2e-down:
	$(DC_E2E) down -v --remove-orphans

# ---------- Tudo ----------
check-all: lint test frontend-check frontend-test frontend-build e2e
