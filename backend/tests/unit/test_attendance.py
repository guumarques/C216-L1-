from app.models.absence import AbsenceModel
from app.services.attendance import (
    AttendanceStatus,
    absence_limit,
    attendance_status,
    used_absences,
)


def test_absence_limit_is_percent_of_total_classes():
    assert absence_limit(100, 25) == 25


def test_absence_limit_rounds_down():
    assert absence_limit(30, 25) == 7


def test_each_absence_counts_as_two():
    absences = [AbsenceModel(justified=False), AbsenceModel(justified=False)]

    assert used_absences(absences) == 4


def test_used_absences_ignores_justified():
    absences = [
        AbsenceModel(justified=False),
        AbsenceModel(justified=True),
        AbsenceModel(justified=False),
    ]

    assert used_absences(absences) == 4


def test_used_absences_without_absences_is_zero():
    assert used_absences([]) == 0


def test_status_ok_below_75_percent_of_limit():
    assert attendance_status(18, 25) == AttendanceStatus.OK


def test_status_at_risk_from_75_percent_of_limit():
    assert attendance_status(20, 25) == AttendanceStatus.AT_RISK


def test_status_at_risk_below_limit():
    # 12 faltas de 2 = 24, ainda dentro do limite de 25
    assert attendance_status(24, 25) == AttendanceStatus.AT_RISK


def test_status_failed_above_limit():
    # a 13ª falta leva a 26, acima do limite de 25
    assert attendance_status(26, 25) == AttendanceStatus.FAILED
