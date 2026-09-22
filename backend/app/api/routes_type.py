from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.repositories.type_repository import TypeRepository
from app.api.schemas import TypeOut

router = APIRouter(prefix="/api/types", tags=["types"])

@router.get("", response_model=list[TypeOut])
def list_types(db: Session = Depends(get_db)):
    repo = TypeRepository(db)
    return [TypeOut.model_validate(t) for t in repo.list()]