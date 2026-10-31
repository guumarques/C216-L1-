from sqlalchemy.orm import Session

from app.repositories.user import UserRepository
from app.schemas.user import User, UserCreate, UserUpdate


def list_users(db: Session, skip: int = 0, limit: int = 100) -> list[User]:
    users = UserRepository(db).list(skip=skip, limit=limit)
    return [User.model_validate(user) for user in users]


def get_user(db: Session, user_id: int) -> User | None:
    user = UserRepository(db).get(user_id)
    return User.model_validate(user) if user else None


def create_user(db: Session, data: UserCreate) -> User:
    user = UserRepository(db).create(data)
    return User.model_validate(user)


def update_user(db: Session, user_id: int, data: UserCreate) -> User | None:
    user = UserRepository(db).update(user_id, data)
    return User.model_validate(user) if user else None


def patch_user(db: Session, user_id: int, data: UserUpdate) -> User | None:
    user = UserRepository(db).patch(user_id, data)
    return User.model_validate(user) if user else None


def delete_user(db: Session, user_id: int) -> bool:
    return UserRepository(db).delete(user_id)
