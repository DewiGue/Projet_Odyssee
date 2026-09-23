from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum

class ZoneId(str, Enum):
    RESERVE_PROPRE = "reserve_propre"
    CUVE_NUTRITIVE = "cuve_nutritive"
    SORTIE_POMPE = "sortie_pompe"
    CLIMAT = "climat"
    RETOUR = "retour"

class Sens(str, Enum):
    ENTREE = "entree"
    SORTIE = "sortie"

class CodeQualite(str, Enum):
    VALIDE = "VALIDE"
    SUSPECTE = "SUSPECTE"
    HORS_PLAGE = "HORS_PLAGE"
    MANQUANTE = "MANQUANTE"

@dataclass
class Mesure:
    valeur: float | None
    unite: str
    qualite: CodeQualite
    timestamp: datetime

@dataclass
class EtatZone:
    zone: ZoneId
    sens: Sens
    mesures: dict[str, Mesure] = field(default_factory=dict)