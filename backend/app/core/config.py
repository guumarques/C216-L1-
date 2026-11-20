import os


class Settings:
    database_url: str = os.environ.get(
        "DATABASE_URL",
        "postgresql+psycopg://faltas:faltas@localhost:15432/faltas",
    )


settings = Settings()
