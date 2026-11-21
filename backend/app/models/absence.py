import datetime as dt

from sqlalchemy import ForeignKey, String, UniqueConstraint, false
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class AbsenceModel(Base):
    __tablename__ = "absences"
    __table_args__ = (
        UniqueConstraint("subject_id", "date", name="uq_absences_subject_date"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    subject_id: Mapped[int] = mapped_column(
        ForeignKey("subjects.id", ondelete="CASCADE"), index=True
    )
    date: Mapped[dt.date]
    quantity: Mapped[int]
    justified: Mapped[bool] = mapped_column(default=False, server_default=false())
    note: Mapped[str | None] = mapped_column(String(200))
