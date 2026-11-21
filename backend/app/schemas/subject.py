from pydantic import BaseModel, ConfigDict, Field


class SubjectBase(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=1, max_length=100)
    professor: str | None = Field(default=None, max_length=100)
    total_classes: int = Field(gt=0, le=200)
    absence_limit_percent: int = Field(default=25, ge=1, le=100)


class SubjectCreate(SubjectBase):
    pass


class Subject(SubjectBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
