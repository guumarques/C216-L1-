.PHONY: help install test lint format run clean

BACKEND := backend
POETRY := poetry --directory $(BACKEND)

PYTHON := $(POETRY) run python
PYTEST := $(POETRY) run pytest
UVICORN := $(POETRY) run uvicorn
RUFF := $(POETRY) run ruff

help:
	@echo "Available commands:"
	@echo "  install: Install dependencies"
	@echo "  test: Run tests"
	@echo "  lint: Run linter"
	@echo "  format: Format code"
	@echo "  run: Run the application"
	@echo "  clean: Clean up temporary files"

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