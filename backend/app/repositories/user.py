from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import UserModel
from app.schemas.user import UserCreate, UserUpdate


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100) -> list[UserModel]:
        stmt = select(UserModel).offset(skip).limit(limit)
        return list(self.db.scalars(stmt))

    def get(self, user_id: int) -> UserModel | None:
        return self.db.get(UserModel, user_id)

    def create(self, data: UserCreate) -> UserModel:
        user = UserModel(**data.model_dump())
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def update(self, user_id: int, data: UserCreate) -> UserModel | None:
        user = self.get(user_id)
        if user is None:
            return None
        user.name = data.name
        user.email = data.email
        self.db.commit()
        self.db.refresh(user)
        return user

    def patch(self, user_id: int, data: UserUpdate) -> UserModel | None:
        user = self.get(user_id)
        if user is None:
            return None
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(user, field, value)
        self.db.commit()
        self.db.refresh(user)
        return user

    def delete(self, user_id: int) -> bool:
        user = self.get(user_id)
        if user is None:
            return False
        self.db.delete(user)
        self.db.commit()
        return True
