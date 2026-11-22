.PHONY: help install test lint format format-check run \
	up up-build down ps logs db-upgrade db-current db-shell \
	fe-install fe-dev fe-lint fe-format fe-build

BACKEND := backend
FRONTEND := frontend
NPM := npm --prefix $(FRONTEND)
POETRY := poetry --directory $(BACKEND)

PYTEST := $(POETRY) run pytest
UVICORN := $(POETRY) run uvicorn
RUFF := $(POETRY) run ruff

DC := docker compose

POSTGRES_USER ?= faltas
POSTGRES_DB ?= faltas

help:
	@echo "Backend:"
	@echo "  install          Instala as dependencias do backend (Poetry)"
	@echo "  test             Roda os testes do backend (Pytest)"
	@echo "  lint             Verifica o codigo com Ruff"
	@echo "  format           Formata o codigo com Ruff"
	@echo "  format-check     Confere a formatacao sem alterar arquivos"
	@echo "  run              Sobe a API localmente com reload"
	@echo "Frontend:"
	@echo "  fe-install       Instala as dependencias do frontend (npm)"
	@echo "  fe-dev           Sobe o frontend em modo dev (Vite)"
	@echo "  fe-lint          Verifica o frontend com Biome"
	@echo "  fe-format        Formata o frontend com Biome"
	@echo "  fe-build         Gera o build de producao do frontend"
	@echo "Docker:"
	@echo "  up / up-build    Sobe db e api (up-build reconstroi as imagens)"
	@echo "  down             Derruba os containers"
	@echo "  ps / logs        Status / logs dos containers"
	@echo "  db-upgrade       Aplica as migrations (alembic upgrade head)"
	@echo "  db-current       Mostra a migration atual do banco"
	@echo "  db-shell         Abre o psql dentro do container do banco"

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

# ---------- Frontend ----------
fe-install:
	$(NPM) install

fe-dev:
	$(NPM) run dev

fe-lint:
	$(NPM) run lint

fe-format:
	$(NPM) run format

fe-build:
	$(NPM) run build

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

db-upgrade:
	$(DC) exec api alembic upgrade head

db-current:
	$(DC) exec api alembic current

db-shell:
	$(DC) exec db psql -U $(POSTGRES_USER) -d $(POSTGRES_DB)
