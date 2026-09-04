.PHONY: help install test lint format run clean docker-build docker-up docker-down docker-logs docker-restart db-shell

BACKEND := backend
POETRY := poetry --directory $(BACKEND)

PYTHON := $(POETRY) run python
PYTEST := $(POETRY) run pytest
UVICORN := $(POETRY) run uvicorn
RUFF := $(POETRY) run ruff
DC := docker compose

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

install:
	$(POETRY) install
test:
	$(PYTEST) tests
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
	$(DC) exec db psql -U $${POSTGRES_USER:-aula1} -d $${POSTGRES_DB:-aula1}