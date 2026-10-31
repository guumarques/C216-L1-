.PHONY: help install test lint format run clean docker-build docker-up docker-down docker-logs docker-restart db-shell \
	frontend-install frontend-dev frontend-lint frontend-format frontend-check frontend-test frontend-test-e2e frontend-build check-all

BACKEND := backend
POETRY := poetry --directory $(BACKEND)

PYTHON := $(POETRY) run python
PYTEST := $(POETRY) run pytest
UVICORN := $(POETRY) run uvicorn
RUFF := $(POETRY) run ruff
DC := docker compose

FRONTEND := frontend
NPM := npm --prefix $(FRONTEND)

help:
	@echo "Available commands:"
	@echo "  install: Install dependencies"
	@echo "  test: Run tests"
	@echo "  lint: Run linter"
	@echo "  format: Format code"
	@echo "  run: Run the application"
	@echo "  clean: Clean up temporary files"
	@echo "  docker-build: Build the docker images"
	@echo "  docker-up: Start the containers in the background"
	@echo "  docker-down: Stop and remove the containers"
	@echo "  docker-logs: Follow the containers logs"
	@echo "  docker-restart: Restart the containers"
	@echo "  db-shell: Open a psql shell inside the database container"
	@echo "  frontend-install: Install frontend dependencies"
	@echo "  frontend-dev: Run the frontend dev server"
	@echo "  frontend-lint: Run the frontend linter"
	@echo "  frontend-format: Format frontend code"
	@echo "  frontend-check: Lint + format check (no changes) for the frontend"
	@echo "  frontend-test: Run frontend unit/integration tests"
	@echo "  frontend-test-e2e: Run frontend E2E tests"
	@echo "  frontend-build: Build the frontend for production"
	@echo "  check-all: Run backend (Ruff + Pytest) and frontend (Biome, Vitest, build, E2E) checks"

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

docker-build:
	$(DC) build

docker-up:
	$(DC) up -d --build

docker-down:
	$(DC) down

docker-logs:
	$(DC) logs -f

docker-restart:
	$(DC) restart

db-shell:
	$(DC) exec db psql -U $${POSTGRES_USER:-aula5} -d $${POSTGRES_DB:-aula5}

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

frontend-test-e2e:
	$(NPM) run test:e2e

frontend-build:
	$(NPM) run build

check-all: lint test frontend-check frontend-test frontend-build frontend-test-e2e