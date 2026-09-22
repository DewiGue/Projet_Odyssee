// ⚠️ DONNÉES FICTIVES TEMPORAIRES — à retirer une fois le contrat d'API figé avec Dewi
// et la vraie base de données branchée. Ne pas considérer ces valeurs comme définitives.

export const fakeDashboardState = {
  niveau: { value: 68, unit: '%', status: 'OK' },
  temperature: { value: 21.5, unit: '°C', status: 'OK' },
  pompe: 'ARRÊT',
  etatGlobal: 'OK',
  dernierEvenement: 'Cycle d\'arrosage terminé',
  prochainCycle: '14:30',
  mode: 'AUTO',
}

// ⚠️
// À adapter dès que Dewi précise le format réel des événements/mesures historiques.

export const fakeHistoriqueEvenements = [
  { id: 1, date: '2026-09-22 08:00', message: 'Cycle d\'arrosage démarré' },
  { id: 2, date: '2026-09-22 08:15', message: 'Cycle d\'arrosage terminé' },
  { id: 3, date: '2026-09-22 09:00', message: 'Alerte niveau bas' },
]

export const fakeHistoriqueMesures = [
  { id: 1, date: '2026-09-22 08:00', label: 'Niveau', value: 72, unit: '%', status: 'OK' },
  { id: 2, date: '2026-09-22 08:00', label: 'Température', value: 20.8, unit: '°C', status: 'OK' },
  { id: 3, date: '2026-09-22 09:00', label: 'Niveau', value: 68, unit: '%', status: 'OK' },
]

// ⚠️ DONNÉES FICTIVES TEMPORAIRES — mode crise

export const fakeCriseState = {
  autonomieCible: 48, // heures, valeur fixe du §9
  reserveCible: 40, // %, valeur fixe du §9
  tempsEcoule: 12, // heures
  tempsRestant: 36, // heures
  reserveActuelle: 55, // %
  etat: 'ARROSAGE',
}

export const fakeReserveHistorique = [
  { heure: 0, reserve: 100 },
  { heure: 4, reserve: 88 },
  { heure: 8, reserve: 74 },
  { heure: 12, reserve: 55 },
]