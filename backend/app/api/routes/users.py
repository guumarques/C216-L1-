from fastapi import APIRouter, HTTPException, Query

from app.schemas.user import User, UserCreate, UserUpdate
from app.services import user as user_service

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=list[User])
def list_users(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=100)):
    return user_service.list_users(skip=skip, limit=limit)


@router.post("/", response_model=User, status_code=201)
def create_user(data: UserCreate):
    return user_service.create_user(data)


@router.get("/{user_id}", response_model=User)
def get_user(user_id: int):
    user = user_service.get_user(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/{user_id}", response_model=User)
def replace_user(user_id: int, data: UserCreate):
    user = user_service.update_user(user_id, data)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.patch("/{user_id}", response_model=User)
def patch_user(user_id: int, data: UserUpdate):
    user = user_service.patch_user(user_id, data)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.delete("/{user_id}", status_code=204)
def delete_user(user_id: int):
    if not user_service.delete_user(user_id):
        raise HTTPException(status_code=404, detail="User not found")
