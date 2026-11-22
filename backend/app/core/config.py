import os

DEFAULT_CORS_ORIGINS = "http://localhost:5173,http://127.0.0.1:5173"


def _split_origins(value: str) -> list[str]:
    return [origin.strip() for origin in value.split(",") if origin.strip()]


class Settings:
    database_url: str = os.environ.get(
        "DATABASE_URL",
        "postgresql+psycopg://faltas:faltas@localhost:15432/faltas",
    )
    cors_origins: list[str] = _split_origins(
        os.environ.get("CORS_ORIGINS", DEFAULT_CORS_ORIGINS)
    )


settings = Settings()
