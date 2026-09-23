import { X } from 'lucide-react'
import { usePlants } from '../hooks/usePlants'
import PlantStatusBadge from './PlantStatusBadge'

const GLOW_BY_STATUS = {
  Semis: 'shadow-[0_0_15px_rgba(59,130,246,0.6)] border-blue-400',
  Croissance: 'shadow-[0_0_15px_rgba(251,146,60,0.6)] border-orange-400',
  Récolte: 'shadow-[0_0_15px_rgba(34,197,94,0.6)] border-green-400',
  Malade: 'shadow-[0_0_15px_rgba(239,68,68,0.6)] border-red-400',
  Vide: 'border-gray-600',
}

export default function SerreModal({ onClose }) {
  const { data: plants, isLoading, isError } = usePlants()

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-950 border border-cyan-500/40 rounded-2xl shadow-[0_0_40px_rgba(34,211,238,0.25)] w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">

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

        <div className="p-6 overflow-y-auto">
          {isLoading ? (
            <p className="text-gray-400">Chargement des emplacements...</p>
          ) : null}

          {isError ? (
            <p className="text-red-400">Impossible de charger les emplacements.</p>
          ) : null}

          {plants ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {plants.map((plant) => (
                <div
                  key={plant.id_plant}
                  className={`border rounded-xl p-3 flex flex-col items-center gap-2 bg-gray-900 transition-transform hover:scale-105 ${GLOW_BY_STATUS[plant.statut] ?? 'border-gray-600'}`}
                >
                  <span className="text-xs text-gray-400">#{plant.id_plant}</span>
                  <PlantStatusBadge statut={plant.statut} />
                </div>
              ))}
            </div>
          ) : null}
        </div>

      </div>
    </div>
  )
}