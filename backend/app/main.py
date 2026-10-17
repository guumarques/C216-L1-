from fastapi import FastAPI

from app import models  # noqa: F401 (registra os modelos em Base.metadata)
from app.api.routes.health import router as health_router
from app.api.routes.users import router as users_router

app = FastAPI(title="aula5")
app.include_router(health_router)
app.include_router(users_router)
