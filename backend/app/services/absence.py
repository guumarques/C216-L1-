from sqlalchemy.orm import Session

from app.repositories.absence import AbsenceRepository
from app.repositories.subject import SubjectRepository
from app.schemas.absence import Absence, AbsenceCreate
from app.services.subject import SubjectNotFoundError


class AbsenceNotFoundError(Exception):
    """A falta informada não existe."""


class DuplicateAbsenceDateError(Exception):
    """Já existe falta registrada nessa disciplina nessa data."""


def _ensure_subject_exists(db: Session, subject_id: int) -> None:
    if SubjectRepository(db).get(subject_id) is None:
        raise SubjectNotFoundError(subject_id)


def _ensure_date_available(
    repo: AbsenceRepository,
    subject_id: int,
    data: AbsenceCreate,
    absence_id: int | None = None,
) -> None:
    existing = repo.get_by_date(subject_id, data.date)
    if existing is not None and existing.id != absence_id:
        raise DuplicateAbsenceDateError(data.date)


def _get_or_raise(repo: AbsenceRepository, absence_id: int):
    absence = repo.get(absence_id)
    if absence is None:
        raise AbsenceNotFoundError(absence_id)
    return absence


def list_absences(db: Session, subject_id: int) -> list[Absence]:
    _ensure_subject_exists(db, subject_id)
    absences = AbsenceRepository(db).list_by_subject(subject_id)
    return [Absence.model_validate(a) for a in absences]


def create_absence(db: Session, subject_id: int, data: AbsenceCreate) -> Absence:
    _ensure_subject_exists(db, subject_id)
    repo = AbsenceRepository(db)
    _ensure_date_available(repo, subject_id, data)
    return Absence.model_validate(repo.create(subject_id, data))


def update_absence(db: Session, absence_id: int, data: AbsenceCreate) -> Absence:
    repo = AbsenceRepository(db)
    absence = _get_or_raise(repo, absence_id)
    _ensure_date_available(repo, absence.subject_id, data, absence_id)
    return Absence.model_validate(repo.update(absence, data))


def delete_absence(db: Session, absence_id: int) -> None:
    repo = AbsenceRepository(db)
    repo.delete(_get_or_raise(repo, absence_id))
