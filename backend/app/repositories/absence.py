import datetime as dt

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.absence import AbsenceModel
from app.schemas.absence import AbsenceCreate


class AbsenceRepository:
    def __init__(self, db: Session):
        self.db = db

    def list_by_subject(self, subject_id: int) -> list[AbsenceModel]:
        stmt = (
            select(AbsenceModel)
            .where(AbsenceModel.subject_id == subject_id)
            .order_by(AbsenceModel.date.desc())
        )
        return list(self.db.scalars(stmt))

    def get(self, absence_id: int) -> AbsenceModel | None:
        return self.db.get(AbsenceModel, absence_id)

    def get_by_date(self, subject_id: int, date: dt.date) -> AbsenceModel | None:
        stmt = select(AbsenceModel).where(
            AbsenceModel.subject_id == subject_id, AbsenceModel.date == date
        )
        return self.db.scalars(stmt).first()

    def create(self, subject_id: int, data: AbsenceCreate) -> AbsenceModel:
        absence = AbsenceModel(subject_id=subject_id, **data.model_dump())
        self.db.add(absence)
        self.db.commit()
        self.db.refresh(absence)
        return absence

    def update(self, absence: AbsenceModel, data: AbsenceCreate) -> AbsenceModel:
        for field, value in data.model_dump().items():
            setattr(absence, field, value)
        self.db.commit()
        self.db.refresh(absence)
        return absence

    def delete(self, absence: AbsenceModel) -> None:
        self.db.delete(absence)
        self.db.commit()
