from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.subject import SubjectModel
from app.schemas.subject import SubjectCreate


class SubjectRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self) -> list[SubjectModel]:
        stmt = select(SubjectModel).order_by(SubjectModel.name)
        return list(self.db.scalars(stmt))

    def get(self, subject_id: int) -> SubjectModel | None:
        return self.db.get(SubjectModel, subject_id)

    def get_by_name(self, name: str) -> SubjectModel | None:
        stmt = select(SubjectModel).where(func.lower(SubjectModel.name) == name.lower())
        return self.db.scalars(stmt).first()

    def create(self, data: SubjectCreate) -> SubjectModel:
        subject = SubjectModel(**data.model_dump())
        self.db.add(subject)
        self.db.commit()
        self.db.refresh(subject)
        return subject

    def update(self, subject: SubjectModel, data: SubjectCreate) -> SubjectModel:
        for field, value in data.model_dump().items():
            setattr(subject, field, value)
        self.db.commit()
        self.db.refresh(subject)
        return subject

    def delete(self, subject: SubjectModel) -> None:
        self.db.delete(subject)
        self.db.commit()
