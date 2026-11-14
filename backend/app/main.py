from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models  # noqa: F401 (registra os modelos em Base.metadata)
from app.api.routes.health import router as health_router
from app.api.routes.users import router as users_router
from app.core.config import settings

app = FastAPI(title="aula5")

# O frontend (porta 5173) é outra origem; só as origens listadas em
# CORS_ORIGINS podem ler as respostas da API no navegador.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Content-Type"],
)

app.include_router(health_router)
app.include_router(users_router)
