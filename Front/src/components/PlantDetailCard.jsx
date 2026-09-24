export function displayOrDash(value) {
  return value === null || value === undefined || value === '' ? '—' : value
}

export function displayRange(min, max, unit = '') {
  return min !== null && max !== null && min !== undefined && max !== undefined
    ? `${min} – ${max}${unit}`
    : '—'
}

export default function PlantDetailCard({ plant, type }) {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
        <div className="flex flex-col gap-1">
          <span className="text-gray-400">Type</span>
          <span className="text-gray-100">
            {type
              ? `${type.nom}${type.variete ? ` (${type.variete})` : ''}`
              : displayOrDash(plant.id_type)}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-gray-400">Date semis</span>
          <span className="text-gray-100">{displayOrDash(plant.date_semis)}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-gray-400">Date plantation</span>
          <span className="text-gray-100">{displayOrDash(plant.date_plantation)}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-gray-400">Récolte prévue</span>
          <span className="text-gray-100">{displayOrDash(plant.date_recolte_prevue)}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-gray-400">Quantité</span>
          <span className="text-gray-100">
            {plant.quantite !== null && plant.quantite !== undefined
              ? `${plant.quantite} ${plant.unite_quantite ?? ''}`
              : '—'}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-gray-400">Notes</span>
          <span className="text-gray-100">{displayOrDash(plant.notes)}</span>
        </div>
      </div>

      {type ? (
        <div className="border-t border-gray-800 pt-3 flex flex-col gap-2">
          <h4 className="text-gray-300 font-medium text-sm">Fiche du type « {type.nom} »</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-gray-400">Système de culture</span>
              <span className="text-gray-100">{displayOrDash(type.systeme_culture)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400">Famille</span>
              <span className="text-gray-100">{displayOrDash(type.famille)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400">pH</span>
              <span className="text-gray-100">{displayRange(type.ph_min, type.ph_max)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400">EC</span>
              <span className="text-gray-100">{displayRange(type.ec_min, type.ec_max)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400">Temp. eau</span>
              <span className="text-gray-100">{displayRange(type.temp_eau_min, type.temp_eau_max, '°C')}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400">Temp. air</span>
              <span className="text-gray-100">{displayRange(type.temp_air_min, type.temp_air_max, '°C')}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400">Humidité</span>
              <span className="text-gray-100">{displayRange(type.humidite_min, type.humidite_max, '%')}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400">CO2</span>
              <span className="text-gray-100">{displayRange(type.co2_min, type.co2_max, ' ppm')}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400">PPFD</span>
              <span className="text-gray-100">{displayRange(type.ppfd_min, type.ppfd_max)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400">Photopériode</span>
              <span className="text-gray-100">
                {type.photoperiode_heures !== null ? `${type.photoperiode_heures} h` : '—'}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400">Cycle de culture</span>
              <span className="text-gray-100">
                {type.cycle_culture_jours !== null ? `${type.cycle_culture_jours} jours` : '—'}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400">Rendement</span>
              <span className="text-gray-100">
                {displayRange(type.rendement_min_kg_m2, type.rendement_max_kg_m2, ' kg/m²')}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400">Besoin en eau</span>
              <span className="text-gray-100">
                {type.besoin_eau_l_kg !== null ? `${type.besoin_eau_l_kg} L/kg` : '—'}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400">Actif</span>
              <span className="text-gray-100">{type.actif ? 'Oui' : 'Non'}</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}