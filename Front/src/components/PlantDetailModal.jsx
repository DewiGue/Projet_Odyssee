import { X } from 'lucide-react'
import PlantStatusBadge from './PlantStatusBadge'
import PlantDetailCard from './PlantDetailCard'
import PlantForm from './PlantForm'

export default function PlantDetailModal({
  plant,
  type,
  types,
  mode,
  onModeChange,
  onSubmitForm,
  onReset,
  confirmingReset,
  onConfirmingResetChange,
  isSaving,
  onClose,
}) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-gray-950 border border-cyan-500/40 rounded-2xl shadow-[0_0_40px_rgba(34,211,238,0.25)] w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">

        <div className="flex justify-between items-center px-6 py-4 border-b border-cyan-500/30">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-cyan-300 tracking-wide">
              Emplacement #{plant.id_plant}
            </h2>
            <PlantStatusBadge statut={plant.statut} />
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-cyan-300 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-4">
          {mode === 'edit' ? (
            <PlantForm
              plant={plant}
              types={types}
              onSubmit={onSubmitForm}
              onCancel={() => onModeChange('view')}
              isSaving={isSaving}
            />
          ) : (
            <>
              <PlantDetailCard plant={plant} type={type} />

              <div className="pt-2">
                {plant.statut === 'Vide' ? (
                  <button
                    type="button"
                    onClick={() => onModeChange('edit')}
                    className="px-4 py-2 rounded-lg border border-cyan-500/50 bg-cyan-500/10 text-cyan-300 font-medium hover:bg-cyan-500/20 transition-colors"
                  >
                    Remplir cet emplacement
                  </button>
                ) : confirmingReset ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 border border-red-500/30 bg-red-500/5 rounded-lg p-3">
                    <span className="text-sm text-red-300 flex-1">
                      Confirmer la remise à vide de cet emplacement ? Toutes les informations (type, dates, quantité, notes) seront supprimées.
                    </span>
                    <div className="flex gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onConfirmingResetChange(false)}
                        className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        type="button"
                        onClick={onReset}
                        disabled={isSaving}
                        className="px-4 py-2 rounded-lg border border-red-500/50 bg-red-500/20 text-red-300 font-medium hover:bg-red-500/30 transition-colors disabled:opacity-50"
                      >
                        {isSaving ? 'Réinitialisation...' : 'Oui, vider'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => onModeChange('edit')}
                      className="px-4 py-2 rounded-lg border border-blue-500/50 bg-blue-500/10 text-blue-300 font-medium hover:bg-blue-500/20 transition-colors"
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => onConfirmingResetChange(true)}
                      className="px-4 py-2 rounded-lg border border-red-500/50 text-red-300 font-medium hover:bg-red-500/10 transition-colors"
                    >
                      Vider l'emplacement
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  )
}