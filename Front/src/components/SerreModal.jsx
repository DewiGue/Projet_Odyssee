import { useState } from 'react'
import { X } from 'lucide-react'
import { usePlants } from '../hooks/usePlants'
import { useTypes } from '../hooks/useTypes'
import PlantStatusBadge from './PlantStatusBadge'

const GLOW_BY_STATUS = {
  Semis: 'shadow-[0_0_15px_rgba(59,130,246,0.6)] border-blue-400',
  Croissance: 'shadow-[0_0_15px_rgba(251,146,60,0.6)] border-orange-400',
  Récolte: 'shadow-[0_0_15px_rgba(34,197,94,0.6)] border-green-400',
  Malade: 'shadow-[0_0_15px_rgba(239,68,68,0.6)] border-red-400',
  Vide: 'border-gray-600',
}

// Affiche "—" pour toute valeur absente (null/undefined/vide), cohérent
// avec l'affichage déjà utilisé pour les mesures MISSING/STALE.
function displayOrDash(value) {
  return value === null || value === undefined || value === '' ? '—' : value
}

export default function SerreModal({ onClose }) {
  const { data: plants, isLoading, isError } = usePlants()
  const { data: types } = useTypes()
  const [selectedId, setSelectedId] = useState(null)

  const selectedPlant = plants?.find((p) => p.id_plant === selectedId) ?? null
  const selectedType = types?.find((t) => t.id_type === selectedPlant?.id_type) ?? null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-950 border border-cyan-500/40 rounded-2xl shadow-[0_0_40px_rgba(34,211,238,0.25)] w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col">

        <div className="flex justify-between items-center px-6 py-4 border-b border-cyan-500/30">
          <h2 className="text-xl font-bold text-cyan-300 tracking-wide">
            VUE DE LA SERRE
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-cyan-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-6">
          {isLoading ? (
            <p className="text-gray-400">Chargement des emplacements...</p>
          ) : null}

          {isError ? (
            <p className="text-red-400">Impossible de charger les emplacements.</p>
          ) : null}

          {plants ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
              {plants.map((plant) => {
                const plantType = types?.find((t) => t.id_type === plant.id_type) ?? null

                return (
                  <button
                    type="button"
                    key={plant.id_plant}
                    onClick={() => setSelectedId(plant.id_plant)}
                    className={`border rounded-xl p-3 flex flex-col items-center gap-2 bg-gray-900 transition-transform hover:scale-105 ${
                      selectedId === plant.id_plant ? 'ring-2 ring-cyan-400' : ''
                    } ${GLOW_BY_STATUS[plant.statut] ?? 'border-gray-600'}`}
                  >
                    <span className="text-xs text-gray-400 text-center">
                      {plantType ? plantType.nom : '—'}
                    </span>
                    <PlantStatusBadge statut={plant.statut} />
                  </button>
                )
              })}
            </div>
          ) : null}

          {selectedPlant ? (
            <div className="border border-cyan-500/30 rounded-xl p-4 bg-gray-900 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h3 className="text-cyan-300 font-semibold">
                  Emplacement #{selectedPlant.id_plant}
                </h3>
                <PlantStatusBadge statut={selectedPlant.statut} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400">Type</span>
                  <span className="text-gray-100">
                    {selectedType
                      ? `${selectedType.nom}${selectedType.variete ? ` (${selectedType.variete})` : ''}`
                      : displayOrDash(selectedPlant.id_type)}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400">Date semis</span>
                  <span className="text-gray-100">{displayOrDash(selectedPlant.date_semis)}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400">Date plantation</span>
                  <span className="text-gray-100">{displayOrDash(selectedPlant.date_plantation)}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400">Récolte prévue</span>
                  <span className="text-gray-100">{displayOrDash(selectedPlant.date_recolte_prevue)}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400">Quantité</span>
                  <span className="text-gray-100">
                    {selectedPlant.quantite !== null && selectedPlant.quantite !== undefined
                      ? `${selectedPlant.quantite} ${selectedPlant.unite_quantite ?? ''}`
                      : '—'}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400">Notes</span>
                  <span className="text-gray-100">{displayOrDash(selectedPlant.notes)}</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

      </div>
    </div>
  )
}