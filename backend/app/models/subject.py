from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base

class Subject(Base):
    __tablename__ = "subjects"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    professor: Mapped[str | None] = mapped_column(String(100))
    total_classes: Mapped[int]
    absence_limit_percent: Mapped[int] = mapped_column(default=25, server_default="25")
    