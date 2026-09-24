import pytest

from app.calculator import add, divide, multiply, subtract


@pytest.fixture
def sample_pair():
    return 10, 5


def test_add(sample_pair):
    a, b = sample_pair
    assert add(a, b) == 15


def test_subtract(sample_pair):
    a, b = sample_pair
    assert subtract(a, b) == 5


def test_multiply(sample_pair):
    a, b = sample_pair
    assert multiply(a, b) == 50


@pytest.mark.parametrize(
    "a, b, expected",
    [
        (10, 5, 2),
        (9, 3, 3),
        (-10, 5, -2),
        (0, 5, 0),
    ],
)
def test_divide(a, b, expected):
    assert divide(a, b) == expected


def test_divide_by_zero_raises():
    with pytest.raises(ZeroDivisionError):
        divide(10, 0)
