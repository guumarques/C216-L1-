from sqlalchemy.orm import Session

from app.repositories.subject import SubjectRepository
from app.schemas.subject import Subject, SubjectCreate


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


def _get_or_raise(repo: SubjectRepository, subject_id: int):
    subject = repo.get(subject_id)
    if subject is None:
        raise SubjectNotFoundError(subject_id)
    return subject


def list_subjects(db: Session) -> list[Subject]:
    return [Subject.model_validate(s) for s in SubjectRepository(db).list()]


def get_subject(db: Session, subject_id: int) -> Subject:
    subject = _get_or_raise(SubjectRepository(db), subject_id)
    return Subject.model_validate(subject)


def create_subject(db: Session, data: SubjectCreate) -> Subject:
    repo = SubjectRepository(db)
    _ensure_name_available(repo, data.name)
    return Subject.model_validate(repo.create(data))


def update_subject(db: Session, subject_id: int, data: SubjectCreate) -> Subject:
    repo = SubjectRepository(db)
    subject = _get_or_raise(repo, subject_id)
    _ensure_name_available(repo, data.name, subject_id)
    return Subject.model_validate(repo.update(subject, data))


def delete_subject(db: Session, subject_id: int) -> None:
    repo = SubjectRepository(db)
    subject = _get_or_raise(repo, subject_id)
    repo.delete(subject)
