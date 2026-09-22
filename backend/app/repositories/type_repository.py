from sqlalchemy.orm import Session
from app.db.orm import TypeORM

class TypeRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self) -> list[TypeORM]:
        return self.db.query(TypeORM).all()

    def get(self, id: int) -> TypeORM | None:
        return self.db.get(TypeORM, id)

    def create(self, data: dict) -> TypeORM:
        obj = TypeORM(**data)
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj