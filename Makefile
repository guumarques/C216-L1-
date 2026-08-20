.PHONY: help install test lint format run clean

PYTHON := poetry run python
PYTEST := poetry run pytest
UVICORN := poetry run uvicorn
RUFF := poetry run ruff

help:
	@echo "Available commands:"
	@echo "  install: Install dependencies"
	@echo "  test: Run tests"
	@echo "  lint: Run linter"
	@echo "  format: Format code"
	@echo "  run: Run the application"
	@echo "  clean: Clean up temporary files"

install:
	poetry install
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