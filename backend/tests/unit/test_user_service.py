from app.schemas.user import UserCreate, UserUpdate
from app.services import user as user_service


def test_create_user():
    user = user_service.create_user(UserCreate(name="Ana", email="ana@example.com"))
    assert user.id == 1
    assert user.name == "Ana"


def test_list_users_empty():
    assert user_service.list_users() == []


def test_get_user_not_found():
    assert user_service.get_user(999) is None


def test_update_user_replaces_fields():
    created = user_service.create_user(UserCreate(name="Ana", email="ana@example.com"))
    updated = user_service.update_user(
        created.id, UserCreate(name="Ana Paula", email="ana@example.com")
    )
    assert updated.name == "Ana Paula"


def test_update_user_not_found():
    assert user_service.update_user(999, UserCreate(name="X", email="x@x.com")) is None


def test_patch_user_partial_update():
    created = user_service.create_user(UserCreate(name="Ana", email="ana@example.com"))
    patched = user_service.patch_user(created.id, UserUpdate(name="Ana P."))
    assert patched.name == "Ana P."
    assert patched.email == "ana@example.com"


def test_delete_user():
    created = user_service.create_user(UserCreate(name="Ana", email="ana@example.com"))
    assert user_service.delete_user(created.id) is True
    assert user_service.delete_user(created.id) is False
