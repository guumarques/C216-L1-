from sqlalchemy.orm import Session

from app.repositories.user import UserRepository
from app.schemas.user import User, UserCreate, UserUpdate


class DuplicateEmailError(Exception):
    """Já existe outro usuário com o e-mail informado."""


def _ensure_email_available(
    repo: UserRepository, email: str | None, user_id: int | None = None
) -> None:
    if email is None:
        return
    existing = repo.get_by_email(email)
    if existing is not None and existing.id != user_id:
        raise DuplicateEmailError(email)


def list_users(db: Session, skip: int = 0, limit: int = 100) -> list[User]:
    users = UserRepository(db).list(skip=skip, limit=limit)
    return [User.model_validate(user) for user in users]


def get_user(db: Session, user_id: int) -> User | None:
    user = UserRepository(db).get(user_id)
    return User.model_validate(user) if user else None


def create_user(db: Session, data: UserCreate) -> User:
    repo = UserRepository(db)
    _ensure_email_available(repo, data.email)
    user = repo.create(data)
    return User.model_validate(user)


def update_user(db: Session, user_id: int, data: UserCreate) -> User | None:
    repo = UserRepository(db)
    if repo.get(user_id) is None:
        return None
    _ensure_email_available(repo, data.email, user_id)
    user = repo.update(user_id, data)
    return User.model_validate(user)


def patch_user(db: Session, user_id: int, data: UserUpdate) -> User | None:
    repo = UserRepository(db)
    if repo.get(user_id) is None:
        return None
    _ensure_email_available(repo, data.email, user_id)
    user = repo.patch(user_id, data)
    return User.model_validate(user)


def delete_user(db: Session, user_id: int) -> bool:
    return UserRepository(db).delete(user_id)
