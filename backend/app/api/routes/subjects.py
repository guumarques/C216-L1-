from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.subject import Subject, SubjectCreate
from app.services import subject as subject_service
from app.services.subject import DuplicateSubjectNameError, SubjectNotFoundError

router = APIRouter(prefix="/subjects", tags=["subjects"])

SUBJECT_NOT_FOUND = "Disciplina não encontrada."
DUPLICATE_NAME = "Já existe uma disciplina com esse nome."


@router.get("/", response_model=list[Subject])
def list_subjects(db: Session = Depends(get_db)):
    return subject_service.list_subjects(db)


@router.post("/", response_model=Subject, status_code=201)
def create_subject(data: SubjectCreate, db: Session = Depends(get_db)):
    try:
        return subject_service.create_subject(db, data)
    except DuplicateSubjectNameError:
        raise HTTPException(status_code=409, detail=DUPLICATE_NAME) from None


@router.get("/{subject_id}", response_model=Subject)
def get_subject(subject_id: int, db: Session = Depends(get_db)):
    try:
        return subject_service.get_subject(db, subject_id)
    except SubjectNotFoundError:
        raise HTTPException(status_code=404, detail=SUBJECT_NOT_FOUND) from None


@router.put("/{subject_id}", response_model=Subject)
def update_subject(subject_id: int, data: SubjectCreate, db: Session = Depends(get_db)):
    try:
        return subject_service.update_subject(db, subject_id, data)
    except SubjectNotFoundError:
        raise HTTPException(status_code=404, detail=SUBJECT_NOT_FOUND) from None
    except DuplicateSubjectNameError:
        raise HTTPException(status_code=409, detail=DUPLICATE_NAME) from None


@router.delete("/{subject_id}", status_code=204)
def delete_subject(subject_id: int, db: Session = Depends(get_db)):
    try:
        subject_service.delete_subject(db, subject_id)
    except SubjectNotFoundError:
        raise HTTPException(status_code=404, detail=SUBJECT_NOT_FOUND) from None
