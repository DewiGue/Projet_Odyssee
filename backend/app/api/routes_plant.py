from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.repositories.plant_repository import PlantRepository
from app.api.schemas import PlantOut, PlantCreate, PlantUpdate

router = APIRouter(prefix="/api/plants", tags=["plants"])

def to_orm_dict(data: dict) -> dict:
    mapping = {"id_type": "Id_Type"}
    return {mapping.get(k, k): v for k, v in data.items()}

@router.get("", response_model=list[PlantOut])
def list_plants(db: Session = Depends(get_db)):
    repo = PlantRepository(db)
    return [PlantOut.model_validate(p) for p in repo.list()]

@router.get("/{id}", response_model=PlantOut)
def get_plant(id: int, db: Session = Depends(get_db)):
    repo = PlantRepository(db)
    obj = repo.get(id)
    if obj is None:
        raise HTTPException(status_code=404, detail="Plant introuvable")
    return PlantOut.model_validate(obj)

@router.post("", response_model=PlantOut, status_code=201)
def create_plant(data: PlantCreate, db: Session = Depends(get_db)):
    repo = PlantRepository(db)
    obj = repo.create(to_orm_dict(data.model_dump()))
    return PlantOut.model_validate(obj)

@router.put("/{id}", response_model=PlantOut)
def update_plant(id: int, data: PlantUpdate, db: Session = Depends(get_db)):
    repo = PlantRepository(db)
    payload = to_orm_dict(data.model_dump(exclude_unset=True))
    obj = repo.update(id, payload)
    if obj is None:
        raise HTTPException(status_code=404, detail="Plant introuvable")
    return PlantOut.model_validate(obj)

@router.delete("/{id}", status_code=204)
def delete_plant(id: int, db: Session = Depends(get_db)):
    repo = PlantRepository(db)
    if not repo.delete(id):
        raise HTTPException(status_code=404, detail="Plant introuvable")