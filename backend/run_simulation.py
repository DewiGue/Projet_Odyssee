"""
Orchestrateur de la simulation — Phase 2/9 (horloge + export JSON, version simple).

Enchaîne les 5 zones à chaque tick, accumule toutes les mesures, et
écrit le tout en JSON à la fin. Pas encore de vitesse réglable en
temps réel (juste un nombre de ticks + une durée par tick) — à
ajouter si besoin une fois que le premier jet tourne.

Usage :
    python run_simulation.py --ticks 100 --dt 1 --out simulation_output.json
"""

import argparse
import json
from datetime import datetime, timezone

from app.domain.zones import ZoneId, Sens, CodeQualite, Mesure, EtatZone
from app.domain.config import CONSIGNE_PH, CONSIGNE_EC, TEMP_EAU_CIBLE, NIVEAU_RESERVE_L
from app.domain.simulation import (
    tick_reserve_propre,
    tick_cuve_nutritive,
    tick_sortie_pompe,
    tick_climat,
    tick_retour,
)


def etat_initial() -> EtatZone:
    """Point de départ : réserve au niveau nominal, valeurs au milieu des consignes."""
    now = datetime.now(timezone.utc)
    return EtatZone(
        zone=ZoneId.RESERVE_PROPRE,
        sens=Sens.SORTIE,
        mesures={
            "niveau_l": Mesure(NIVEAU_RESERVE_L, "L", CodeQualite.VALIDE, now),
            "ph": Mesure(sum(CONSIGNE_PH) / 2, "pH", CodeQualite.VALIDE, now),
            "ec": Mesure(sum(CONSIGNE_EC) / 2, "mS/cm", CodeQualite.VALIDE, now),
            "temperature": Mesure(sum(TEMP_EAU_CIBLE) / 2, "°C", CodeQualite.VALIDE, now),
        },
    )


def etat_vers_records(etat: EtatZone) -> list[dict]:
    """Convertit un EtatZone en liste d'enregistrements JSON plats (1 par mesure)."""
    return [
        {
            "zone": etat.zone.value,
            "sens": etat.sens.value,
            "mesure": nom,
            "valeur": mesure.valeur,
            "unite": mesure.unite,
            "qualite": mesure.qualite.value,
            "timestamp": mesure.timestamp.isoformat(),
        }
        for nom, mesure in etat.mesures.items()
    ]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--ticks", type=int, default=60, help="Nombre de ticks à simuler")
    parser.add_argument("--dt", type=float, default=1.0, help="Durée simulée par tick (s)")
    parser.add_argument("--out", type=str, default="simulation_output.json")
    args = parser.parse_args()

    tous_les_records: list[dict] = []
    etat_reserve = etat_initial()

    for _ in range(args.ticks):
        etat_reserve = tick_reserve_propre(etat_reserve, args.dt)
        etat_cuve = tick_cuve_nutritive(etat_reserve, args.dt)
        etat_pompe = tick_sortie_pompe(etat_cuve, args.dt)
        etat_climat = tick_climat(etat_pompe, args.dt)
        etat_retour = tick_retour(etat_climat, args.dt)

        for etat in (etat_reserve, etat_cuve, etat_pompe, etat_climat, etat_retour):
            tous_les_records.extend(etat_vers_records(etat))

        # Bouclage simplifié : seule l'EC du retour influence la réserve
        # au tick suivant pour l'instant (approximation à affiner —
        # niveau/température du retour ne sont pas encore rebouclés).
        etat_reserve.mesures["ec"] = etat_retour.mesures["ec"]

    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(tous_les_records, f, indent=2, ensure_ascii=False)

    print(f"{len(tous_les_records)} mesures écrites dans {args.out}")


if __name__ == "__main__":
    main()
