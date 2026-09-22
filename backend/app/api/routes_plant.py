from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.repositories.plant_repository import PlantRepository
from app.api.schemas import PlantOut, PlantCreate

router = APIRouter(prefix="/api/plants", tags=["plants"])

@router.get("", response_model=list[PlantOut])
def list_plants(db: Session = Depends(get_db)):
    repo = PlantRepository(db)
    return [PlantOut.model_validate(p) for p in repo.list()]

@router.post("", response_model=PlantOut)
def create_plant(data: PlantCreate, db: Session = Depends(get_db)):
    repo = PlantRepository(db)
    obj = repo.create(data.model_dump())
    return PlantOut.model_validate(obj)