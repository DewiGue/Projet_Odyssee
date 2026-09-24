import { useState } from 'react'
import { X, Search } from 'lucide-react'
import { usePlants, useUpdatePlant } from '../hooks/usePlants'
import { useTypes } from '../hooks/useTypes'
import PlantStatusBadge from './PlantStatusBadge'
import PlantDetailModal from './PlantDetailModal'

const GLOW_BY_STATUS = {
  Semis: 'shadow-[0_0_15px_rgba(59,130,246,0.6)] border-blue-400',
  Croissance: 'shadow-[0_0_15px_rgba(251,146,60,0.6)] border-orange-400',
  Récolte: 'shadow-[0_0_15px_rgba(34,197,94,0.6)] border-green-400',
  Malade: 'shadow-[0_0_15px_rgba(239,68,68,0.6)] border-red-400',
  Vide: 'border-gray-600',
}

export default function SerreModal({ onClose }) {
  const { data: plants, isLoading, isError } = usePlants()
  const { data: types } = useTypes()
  const updatePlant = useUpdatePlant()
  const [selectedId, setSelectedId] = useState(null)
  const [mode, setMode] = useState('view')
  const [confirmingReset, setConfirmingReset] = useState(false)
  const [search, setSearch] = useState('')

  const selectedPlant = plants?.find((p) => p.id_plant === selectedId) ?? null
  const selectedType = types?.find((t) => t.id_type === selectedPlant?.id_type) ?? null

  const filteredPlants = plants?.filter((plant) => {
    const plantType = types?.find((t) => t.id_type === plant.id_type) ?? null
    const haystack = `${plantType?.nom ?? ''} ${plant.statut} #${plant.id_plant}`.toLowerCase()
    return haystack.includes(search.toLowerCase())
  }) ?? []

  function handleSelect(id) {
    setSelectedId(id)
    setMode('view')
    setConfirmingReset(false)
  }

  function handleCloseDetail() {
    setSelectedId(null)
    setMode('view')
    setConfirmingReset(false)
  }

  function handleSubmitForm(payload) {
    updatePlant.mutate(
      { id: selectedPlant.id_plant, data: payload },
      { onSuccess: () => setMode('view') }
    )
  }

  function handleReset() {
    updatePlant.mutate(
      {
        id: selectedPlant.id_plant,
        data: {
          date_semis: null,
          date_plantation: null,
          date_recolte_prevue: null,
          quantite: null,
          unite_quantite: null,
          statut: 'Vide',
          notes: null,
          id_type: null,
        },
      },
      { onSuccess: () => { setMode('view'); setConfirmingReset(false) } }
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-950 border border-cyan-500/40 rounded-2xl shadow-[0_0_40px_rgba(34,211,238,0.25)] w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col">

        <div className="flex justify-between items-center px-6 py-4 border-b border-cyan-500/30">
          <h2 className="text-xl font-bold text-cyan-300 tracking-wide">VUE DE LA SERRE</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-cyan-300 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-6">
          {isLoading ? <p className="text-gray-400">Chargement des emplacements...</p> : null}
          {isError ? <p className="text-red-400">Impossible de charger les emplacements.</p> : null}

          {plants ? (
            <>
              <div className="relative max-w-sm">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher (type, statut, #emplacement...)"
                  className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
                {filteredPlants.map((plant) => {
                  const plantType = types?.find((t) => t.id_type === plant.id_type) ?? null
                  return (
                    <button
                      type="button"
                      key={plant.id_plant}
                      onClick={() => handleSelect(plant.id_plant)}
                      className={`border rounded-xl p-3 flex flex-col items-center gap-2 bg-gray-900 transition-transform hover:scale-105 ${GLOW_BY_STATUS[plant.statut] ?? 'border-gray-600'}`}
                    >
                      <span className="text-xs text-gray-400 text-center">
                        {plantType ? plantType.nom : '—'}
                      </span>
                      <PlantStatusBadge statut={plant.statut} />
                    </button>
                  )
                })}
              </div>

              {filteredPlants.length === 0 ? (
                <p className="text-gray-500 text-sm text-center">Aucun emplacement ne correspond à la recherche.</p>
              ) : null}
            </>
          ) : null}
        </div>

      </div>

      {selectedPlant ? (
        <PlantDetailModal
          plant={selectedPlant}
          type={selectedType}
          types={types}
          mode={mode}
          onModeChange={setMode}
          onSubmitForm={handleSubmitForm}
          onReset={handleReset}
          confirmingReset={confirmingReset}
          onConfirmingResetChange={setConfirmingReset}
          isSaving={updatePlant.isPending}
          onClose={handleCloseDetail}
        />
      ) : null}
    </div>
  )
}