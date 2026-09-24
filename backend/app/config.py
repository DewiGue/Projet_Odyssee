from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str

    class Config:
        env_file = ".env"
        extra = "ignore"   # <-- ajoute cette ligne

settings = Settings()   # <-- cette ligne doit être présente
