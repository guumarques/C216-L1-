from app.models.absence import AbsenceModel
from app.services.attendance import (
    AttendanceStatus,
    absence_limit,
    attendance_status,
    used_absences,
)


def test_absence_limit_is_percent_of_total_classes():
    assert absence_limit(80, 25) == 20


def test_absence_limit_rounds_down():
    assert absence_limit(30, 25) == 7


def test_used_absences_ignores_justified():
    absences = [
        AbsenceModel(quantity=2, justified=False),
        AbsenceModel(quantity=4, justified=True),
        AbsenceModel(quantity=1, justified=False),
    ]

    assert used_absences(absences) == 3


def test_used_absences_without_absences_is_zero():
    assert used_absences([]) == 0


def test_status_ok_below_75_percent_of_limit():
    assert attendance_status(14, 20) == AttendanceStatus.OK


def test_status_at_risk_from_75_percent_of_limit():
    assert attendance_status(15, 20) == AttendanceStatus.AT_RISK


def test_status_at_risk_exactly_on_limit():
    assert attendance_status(20, 20) == AttendanceStatus.AT_RISK


def test_status_failed_above_limit():
    assert attendance_status(21, 20) == AttendanceStatus.FAILED
