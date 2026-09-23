from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.repositories.type_repository import TypeRepository
from app.api.schemas import TypeOut, TypeCreate, TypeUpdate

router = APIRouter(prefix="/api/types", tags=["types"])

def to_orm_dict(data: dict) -> dict:
    mapping = {"id_type": "Id_Type"}
    return {mapping.get(k, k): v for k, v in data.items() if v is not None or k not in mapping}

@router.get("", response_model=list[TypeOut])
def list_types(db: Session = Depends(get_db)):
    repo = TypeRepository(db)
    return [TypeOut.model_validate(t) for t in repo.list()]

@router.get("/{id}", response_model=TypeOut)
def get_type(id : int, db: Session = Depends(get_db)):
    repo = TypeRepository(db)
    obj = repo.get(id)
    
    if obj is None:
        raise HTTPException(status_code=404, detail="Type introuvable")
    return TypeOut.model_validate(obj)

@router.post("", response_model=TypeOut, status_code=201)
def create_plant(data: TypeCreate, db: Session = Depends(get_db)):
    repo = TypeRepository(db)
    obj = repo.create(to_orm_dict(data.model_dump()))
    return TypeOut.model_validate(obj)

@router.put("/{id}", response_model=TypeOut)
def update_plant(id: int, data: TypeUpdate, db: Session = Depends(get_db)):
    repo = TypeRepository(db)
    payload = to_orm_dict(data.model_dump(exclude_unset=True))
    obj = repo.update(id, payload)
    if obj is None:
        raise HTTPException(status_code=404, detail="Type introuvable")
    return TypeOut.model_validate(obj)

@router.delete("/{id}", status_code=204)
def delete_plant(id: int, db: Session = Depends(get_db)):
    repo = TypeRepository(db)
    if not repo.delete(id):
        raise HTTPException(status_code=404, detail="Type introuvable")