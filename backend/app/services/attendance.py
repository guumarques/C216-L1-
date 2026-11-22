from collections.abc import Iterable
from enum import StrEnum

from app.models.absence import AbsenceModel

RISK_THRESHOLD = 0.75
# Só há uma aula por dia de cada disciplina, e faltar nela conta 2 faltas
ABSENCES_PER_DAY = 2


class AttendanceStatus(StrEnum):
    OK = "ok"
    AT_RISK = "at_risk"
    FAILED = "failed"


def absence_limit(total_classes: int, limit_percent: int) -> int:
    return total_classes * limit_percent // 100


def used_absences(absences: Iterable[AbsenceModel]) -> int:
    days_missed = sum(1 for a in absences if not a.justified)
    return days_missed * ABSENCES_PER_DAY


def attendance_status(used: int, limit: int) -> AttendanceStatus:
    if used > limit:
        return AttendanceStatus.FAILED
    if used >= limit * RISK_THRESHOLD:
        return AttendanceStatus.AT_RISK
    return AttendanceStatus.OK
