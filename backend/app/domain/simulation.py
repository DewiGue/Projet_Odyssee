"""
Logique de simulation du circuit d'eau — Phase 4 de la feuille de route.

Principe commun à toutes les fonctions :
- on part de l'état de la zone amont
- on fait dériver/corriger les valeurs vers une cible (consigne ou
  valeur amont), à une vitesse propre à chaque zone
- on ajoute un bruit gaussien borné pour éviter des courbes trop lisses
- on renvoie un nouvel EtatZone (on ne modifie jamais l'état reçu)
"""

import random
from datetime import datetime, timezone

from app.domain.zones import ZoneId, Sens, CodeQualite, Mesure, EtatZone
from app.domain.config import CONSIGNE_PH, CONSIGNE_EC, TEMP_EAU_CIBLE, NIVEAU_RESERVE_L

# --- Constantes de simulation ---
# À déplacer dans config.py si tu préfères tout centraliser ; laissées
# ici pour l'instant pour que ce fichier soit autonome.

VITESSE_CORRECTION_CUVE = 0.15      # la cuve corrige vite (rôle actif)
VITESSE_RELAXATION_RESERVE = 0.02   # la réserve dérive lentement (passif)

DEBIT_NOMINAL_L_S = 0.5
PRESSION_NOMINALE_BAR = 1.8

TEMP_AIR_CIBLE = (20.0, 24.0)
HUMIDITE_CIBLE = (60.0, 75.0)
ECHANGE_THERMIQUE_CLIMAT = 0.05     # influence de l'air sur la temp. eau

CONSOMMATION_EAU_L_S = 0.01         # eau prélevée par les plantes
FACTEUR_CONCENTRATION_RETOUR = 1.03 # l'EC monte légèrement au retour

SEUIL_APPOINT_L = NIVEAU_RESERVE_L * 0.9
DEBIT_APPOINT_L_S = 0.2


def _bruit(amplitude: float) -> float:
    """Petit bruit gaussien centré sur 0, borné par l'amplitude donnée."""
    return random.gauss(0, amplitude)


def _relaxer(valeur: float, cible: float, vitesse: float) -> float:
    """Rapproche `valeur` de `cible` d'une fraction `vitesse` de l'écart."""
    return valeur + (cible - valeur) * vitesse


def _milieu(plage: tuple[float, float]) -> float:
    return sum(plage) / 2


def tick_reserve_propre(etat_precedent: EtatZone, dt: float) -> EtatZone:
    """
    Niveau : baisse selon la consommation, remonte via appoint automatique
    sous le seuil. pH/EC/température : dérivent lentement vers leur
    consigne (stabilisation passive, pas de traitement actif ici).
    """
    now = datetime.now(timezone.utc)
    m = etat_precedent.mesures

    niveau = m["niveau_l"].valeur - CONSOMMATION_EAU_L_S * dt
    if niveau < SEUIL_APPOINT_L:
        niveau += DEBIT_APPOINT_L_S * dt
    niveau = max(0.0, niveau)

    ph = _relaxer(m["ph"].valeur, _milieu(CONSIGNE_PH), VITESSE_RELAXATION_RESERVE) + _bruit(0.02)
    ec = _relaxer(m["ec"].valeur, _milieu(CONSIGNE_EC), VITESSE_RELAXATION_RESERVE) + _bruit(0.02)
    temperature = _relaxer(m["temperature"].valeur, _milieu(TEMP_EAU_CIBLE), VITESSE_RELAXATION_RESERVE) + _bruit(0.05)

    return EtatZone(
        zone=ZoneId.RESERVE_PROPRE,
        sens=Sens.SORTIE,
        mesures={
            "niveau_l": Mesure(round(niveau, 2), "L", CodeQualite.VALIDE, now),
            "ph": Mesure(round(ph, 2), "pH", CodeQualite.VALIDE, now),
            "ec": Mesure(round(ec, 2), "mS/cm", CodeQualite.VALIDE, now),
            "temperature": Mesure(round(temperature, 2), "°C", CodeQualite.VALIDE, now),
        },
    )


def tick_cuve_nutritive(etat_reserve: EtatZone, dt: float) -> EtatZone:
    """
    Correction active pH/EC vers la consigne commune de la serre.
    Plus rapide que la relaxation de la réserve : c'est le rôle de la
    cuve (ajout de nutriments, correcteur de pH).
    """
    now = datetime.now(timezone.utc)
    m = etat_reserve.mesures

    ph = _relaxer(m["ph"].valeur, _milieu(CONSIGNE_PH), VITESSE_CORRECTION_CUVE) + _bruit(0.015)
    ec = _relaxer(m["ec"].valeur, _milieu(CONSIGNE_EC), VITESSE_CORRECTION_CUVE) + _bruit(0.015)
    temperature = m["temperature"].valeur + _bruit(0.03)  # pas de chauffe ici

    return EtatZone(
        zone=ZoneId.CUVE_NUTRITIVE,
        sens=Sens.SORTIE,
        mesures={
            "niveau_l": m["niveau_l"],
            "ph": Mesure(round(ph, 2), "pH", CodeQualite.VALIDE, now),
            "ec": Mesure(round(ec, 2), "mS/cm", CodeQualite.VALIDE, now),
            "temperature": Mesure(round(temperature, 2), "°C", CodeQualite.VALIDE, now),
        },
    )


def tick_sortie_pompe(etat_cuve: EtatZone, dt: float) -> EtatZone:
    """
    Ajoute débit et pression. La pompe déplace l'eau, elle ne la traite
    pas : pH/EC/température passent tels quels.
    """
    now = datetime.now(timezone.utc)
    m = etat_cuve.mesures

    debit = DEBIT_NOMINAL_L_S + _bruit(0.02)
    pression = PRESSION_NOMINALE_BAR + _bruit(0.05)

    return EtatZone(
        zone=ZoneId.SORTIE_POMPE,
        sens=Sens.SORTIE,
        mesures={
            "debit_l_s": Mesure(round(debit, 3), "L/s", CodeQualite.VALIDE, now),
            "pression_bar": Mesure(round(pression, 2), "bar", CodeQualite.VALIDE, now),
            "ph": m["ph"],
            "ec": m["ec"],
            "temperature": m["temperature"],
        },
    )


def tick_climat(etat_pompe: EtatZone, dt: float) -> EtatZone:
    """
    Zone de culture : ajoute température air / humidité. La température
    de l'eau dérive légèrement vers la température de l'air (échange
    thermique dans les bacs/gouttières).
    """
    now = datetime.now(timezone.utc)
    m = etat_pompe.mesures

    temp_air = _milieu(TEMP_AIR_CIBLE) + _bruit(0.3)
    humidite = _milieu(HUMIDITE_CIBLE) + _bruit(1.0)
    temp_eau = _relaxer(m["temperature"].valeur, temp_air, ECHANGE_THERMIQUE_CLIMAT) + _bruit(0.03)

    return EtatZone(
        zone=ZoneId.CLIMAT,
        sens=Sens.SORTIE,
        mesures={
            "temp_air": Mesure(round(temp_air, 2), "°C", CodeQualite.VALIDE, now),
            "humidite": Mesure(round(humidite, 2), "%", CodeQualite.VALIDE, now),
            "ph": m["ph"],
            "ec": m["ec"],
            "temperature": Mesure(round(temp_eau, 2), "°C", CodeQualite.VALIDE, now),
        },
    )


def tick_retour(etat_climat: EtatZone, dt: float) -> EtatZone:
    """
    Eau de retour vers la cuve : EC légèrement plus élevée (les plantes
    ont consommé de l'eau, concentrant les ions), température proche
    de celle de la zone de culture.
    """
    now = datetime.now(timezone.utc)
    m = etat_climat.mesures

    ec = m["ec"].valeur * FACTEUR_CONCENTRATION_RETOUR + _bruit(0.01)
    ph = m["ph"].valeur + _bruit(0.02)
    temperature = m["temperature"].valeur + _bruit(0.05)

    return EtatZone(
        zone=ZoneId.RETOUR,
        sens=Sens.SORTIE,
        mesures={
            "ph": Mesure(round(ph, 2), "pH", CodeQualite.VALIDE, now),
            "ec": Mesure(round(ec, 2), "mS/cm", CodeQualite.VALIDE, now),
            "temperature": Mesure(round(temperature, 2), "°C", CodeQualite.VALIDE, now),
        },
    )