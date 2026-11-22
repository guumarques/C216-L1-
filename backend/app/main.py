from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.absences import router as absences_router
from app.api.routes.health import router as health_router
from app.api.routes.subjects import router as subjects_router
from app.core.config import settings

app = FastAPI(title="Controle de Faltas")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type"],
)

app.include_router(health_router)
app.include_router(subjects_router)
app.include_router(absences_router)
