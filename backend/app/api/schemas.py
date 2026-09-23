from datetime import date, datetime
from pydantic import BaseModel, Field
from pydantic import BaseModel

class PlantOut(BaseModel):
    id_plant: int = Field(validation_alias="Id_Plant")
    date_semis: date | None
    date_plantation: date | None
    date_recolte_prevue: date | None
    quantite: float
    unite_quantite: str
    statut: str
    notes: str | None
    id_type: int | None = Field(validation_alias="Id_Type")

    model_config = {"from_attributes": True, "populate_by_name": True}
    
class PlantCreate(BaseModel):
    date_semis: date | None = None
    quantite: float
    unite_quantite: str
    statut: str
    notes: str | None = None
    id_type: int | None = None

class PlantUpdate(BaseModel):
    date_semis: date | None = None
    date_plantation: date | None = None
    date_recolte_prevue: date | None = None
    quantite: float | None = None
    unite_quantite: str | None = None
    statut: str | None = None
    notes: str | None = None
    id_type: int | None = None

class TypeOut(BaseModel):
    id_type: int = Field(validation_alias="Id_Type")
    nom: str
    variete: str | None
    systeme_culture: str
    ph_min: float
    ph_max: float
    ec_min: float
    ec_max: float
    temp_eau_min: float
    temp_eau_max: float
    temp_air_min: float
    temp_air_max: float
    famille: str
    humidite_min: float
    humidite_max: float
    co2_min: float | None
    co2_max: float | None
    ppfd_min: float | None
    ppfd_max: float | None
    photoperiode_heures: float | None
    cycle_culture_jours: int | None
    rendement_min_kg_m2: float | None
    rendement_max_kg_m2: float | None
    besoin_eau_l_kg: float | None
    created_at: datetime
    updated_at: datetime
    actif: bool

    model_config = {"from_attributes": True, "populate_by_name": True}

class TypeCreate(BaseModel):
    nom: str
    variete: str | None
    systeme_culture: str
    ph_min: float
    ph_max: float
    ec_min: float
    ec_max: float
    temp_eau_min: float
    temp_eau_max: float
    temp_air_min: float
    temp_air_max: float
    famille: str
    humidite_min: float
    humidite_max: float
    co2_min: float | None
    co2_max: float | None
    ppfd_min: float | None
    ppfd_max: float | None
    photoperiode_heures: float | None
    cycle_culture_jours: int | None
    rendement_min_kg_m2: float | None
    rendement_max_kg_m2: float | None
    besoin_eau_l_kg: float | None
    created_at: datetime
    updated_at: datetime
    actif: bool

class TypeUpdate(BaseModel):
    nom: str
    variete: str | None
    systeme_culture: str
    ph_min: float
    ph_max: float
    ec_min: float
    ec_max: float
    temp_eau_min: float
    temp_eau_max: float
    temp_air_min: float
    temp_air_max: float
    famille: str
    humidite_min: float
    humidite_max: float
    co2_min: float | None
    co2_max: float | None
    ppfd_min: float | None
    ppfd_max: float | None
    photoperiode_heures: float | None
    cycle_culture_jours: int | None
    rendement_min_kg_m2: float | None
    rendement_max_kg_m2: float | None
    besoin_eau_l_kg: float | None
    created_at: datetime
    updated_at: datetime
    actif: bool