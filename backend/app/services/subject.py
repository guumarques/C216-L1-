from sqlalchemy.orm import Session

from app.models.subject import SubjectModel
from app.repositories.subject import SubjectRepository
from app.schemas.subject import Subject, SubjectCreate
from app.services.attendance import absence_limit, attendance_status, used_absences


class SubjectNotFoundError(Exception):
    """A disciplina informada não existe."""


class DuplicateSubjectNameError(Exception):
    """Já existe outra disciplina com o mesmo nome."""


def _ensure_name_available(
    repo: SubjectRepository, name: str, subject_id: int | None = None
) -> None:
    existing = repo.get_by_name(name)
    if existing is not None and existing.id != subject_id:
        raise DuplicateSubjectNameError(name)


def _get_or_raise(repo: SubjectRepository, subject_id: int) -> SubjectModel:
    subject = repo.get(subject_id)
    if subject is None:
        raise SubjectNotFoundError(subject_id)
    return subject


def _to_schema(subject: SubjectModel) -> Subject:
    limit = absence_limit(subject.total_classes, subject.absence_limit_percent)
    used = used_absences(subject.absences)
    return Subject(
        id=subject.id,
        name=subject.name,
        professor=subject.professor,
        total_classes=subject.total_classes,
        absence_limit_percent=subject.absence_limit_percent,
        absence_limit=limit,
        absences_used=used,
        absences_remaining=max(limit - used, 0),
        status=attendance_status(used, limit),
    )


def list_subjects(db: Session) -> list[Subject]:
    return [_to_schema(s) for s in SubjectRepository(db).list()]


def get_subject(db: Session, subject_id: int) -> Subject:
    return _to_schema(_get_or_raise(SubjectRepository(db), subject_id))


def create_subject(db: Session, data: SubjectCreate) -> Subject:
    repo = SubjectRepository(db)
    _ensure_name_available(repo, data.name)
    return _to_schema(repo.create(data))


def update_subject(db: Session, subject_id: int, data: SubjectCreate) -> Subject:
    repo = SubjectRepository(db)
    subject = _get_or_raise(repo, subject_id)
    _ensure_name_available(repo, data.name, subject_id)
    return _to_schema(repo.update(subject, data))


def delete_subject(db: Session, subject_id: int) -> None:
    repo = SubjectRepository(db)
    repo.delete(_get_or_raise(repo, subject_id))
