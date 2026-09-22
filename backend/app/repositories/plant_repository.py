from sqlalchemy.orm import Session
from app.db.orm import PlantORM

class PlantRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self) -> list[PlantORM]:
        return self.db.query(PlantORM).all()

    def get(self, id: int) -> PlantORM | None:
        return self.db.get(PlantORM, id)

    def create(self, data: dict) -> PlantORM:
        obj = PlantORM(**data)
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj