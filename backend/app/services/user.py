from app.schemas.user import User, UserCreate, UserUpdate

_users: dict[int, User] = {}
_next_id = 1


def list_users(skip: int = 0, limit: int = 100) -> list[User]:
    return list(_users.values())[skip : skip + limit]


def get_user(user_id: int) -> User | None:
    return _users.get(user_id)


def create_user(data: UserCreate) -> User:
    global _next_id
    user = User(id=_next_id, **data.model_dump())
    _users[user.id] = user
    _next_id += 1
    return user


def update_user(user_id: int, data: UserCreate) -> User | None:
    if user_id not in _users:
        return None
    user = User(id=user_id, **data.model_dump())
    _users[user_id] = user
    return user


def patch_user(user_id: int, data: UserUpdate) -> User | None:
    existing = _users.get(user_id)
    if existing is None:
        return None
    updated = existing.model_copy(update=data.model_dump(exclude_unset=True))
    _users[user_id] = updated
    return updated


def delete_user(user_id: int) -> bool:
    return _users.pop(user_id, None) is not None


def reset() -> None:
    global _next_id
    _users.clear()
    _next_id = 1
