import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.services import user as user_service


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture(autouse=True)
def reset_user_store():
    user_service.reset()
    yield
    user_service.reset()
