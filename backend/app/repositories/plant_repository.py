from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.db.orm import TypeORM


def utcnow() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


class TypeRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self) -> list[TypeORM]:
        return self.db.query(TypeORM).all()

    def get(self, id: int) -> TypeORM | None:
        return self.db.get(TypeORM, id)

    def create(self, data: dict) -> TypeORM:
        payload = dict(data)
        now = utcnow()

        payload["created_at"] = payload.get("created_at") or now
        payload["updated_at"] = payload.get("updated_at") or now
        payload.setdefault("actif", True)

        obj = TypeORM(**payload)
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def update(self, id: int, data: dict) -> TypeORM | None:
        obj = self.get(id)
        if obj is None:
            return None

        for key, value in data.items():
            if key not in {"Id_Type", "created_at", "updated_at"}:
                setattr(obj, key, value)

        obj.updated_at = utcnow()
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def delete(self, id: int) -> bool:
        obj = self.get(id)
        if obj is None:
            return False

        self.db.delete(obj)
        self.db.commit()
        return True
