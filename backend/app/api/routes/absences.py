from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.absence import Absence, AbsenceCreate
from app.services import absence as absence_service
from app.services.absence import AbsenceNotFoundError, DuplicateAbsenceDateError
from app.services.subject import SubjectNotFoundError

router = APIRouter(tags=["absences"])

SUBJECT_NOT_FOUND = "Disciplina não encontrada."
ABSENCE_NOT_FOUND = "Falta não encontrada."
DUPLICATE_DATE = "Já existe uma falta registrada nessa data para essa disciplina."


@router.get("/subjects/{subject_id}/absences", response_model=list[Absence])
def list_absences(subject_id: int, db: Session = Depends(get_db)):
    try:
        return absence_service.list_absences(db, subject_id)
    except SubjectNotFoundError:
        raise HTTPException(status_code=404, detail=SUBJECT_NOT_FOUND) from None


@router.post("/subjects/{subject_id}/absences", response_model=Absence, status_code=201)
def create_absence(subject_id: int, data: AbsenceCreate, db: Session = Depends(get_db)):
    try:
        return absence_service.create_absence(db, subject_id, data)
    except SubjectNotFoundError:
        raise HTTPException(status_code=404, detail=SUBJECT_NOT_FOUND) from None
    except DuplicateAbsenceDateError:
        raise HTTPException(status_code=409, detail=DUPLICATE_DATE) from None


@router.put("/absences/{absence_id}", response_model=Absence)
def update_absence(absence_id: int, data: AbsenceCreate, db: Session = Depends(get_db)):
    try:
        return absence_service.update_absence(db, absence_id, data)
    except AbsenceNotFoundError:
        raise HTTPException(status_code=404, detail=ABSENCE_NOT_FOUND) from None
    except DuplicateAbsenceDateError:
        raise HTTPException(status_code=409, detail=DUPLICATE_DATE) from None


@router.delete("/absences/{absence_id}", status_code=204)
def delete_absence(absence_id: int, db: Session = Depends(get_db)):
    try:
        absence_service.delete_absence(db, absence_id)
    except AbsenceNotFoundError:
        raise HTTPException(status_code=404, detail=ABSENCE_NOT_FOUND) from None
