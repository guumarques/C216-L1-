import os


class Settings:
    database_url: str = os.environ.get(
        "DATABASE_URL",
        "postgresql+psycopg://aula5:aula5@localhost:15432/aula5",
    )


settings = Settings()
