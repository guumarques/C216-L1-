from fastapi import FastAPI

from app.api.routes.absences import router as absences_router
from app.api.routes.health import router as health_router
from app.api.routes.subjects import router as subjects_router

app = FastAPI(title="Controle de Faltas")
app.include_router(health_router)
app.include_router(subjects_router)
app.include_router(absences_router)
