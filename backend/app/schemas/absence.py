import datetime as dt

from pydantic import BaseModel, ConfigDict, Field, field_validator


class AbsenceBase(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    date: dt.date
    quantity: int = Field(ge=1, le=4)
    justified: bool = False
    note: str | None = Field(default=None, max_length=200)

    @field_validator("date")
    @classmethod
    def date_not_in_future(cls, value: dt.date) -> dt.date:
        if value > dt.date.today():
            raise ValueError("A data da falta não pode ser no futuro.")
        return value


class AbsenceCreate(AbsenceBase):
    pass


class Absence(AbsenceBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    subject_id: int
