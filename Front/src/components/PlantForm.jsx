import { useState } from 'react'

// 5 statuts confirmés par Dewi (données réelles /api/plants)
const STATUTS = ['Semis', 'Croissance', 'Récolte', 'Malade', 'Vide']

export default function PlantForm({ plant, types, onSubmit, onCancel, isSaving }) {
  const [form, setForm] = useState({
    id_type: plant?.id_type ?? '',
    date_semis: plant?.date_semis ?? '',
    date_plantation: plant?.date_plantation ?? '',
    date_recolte_prevue: plant?.date_recolte_prevue ?? '',
    quantite: plant?.quantite ?? '',
    unite_quantite: plant?.unite_quantite ?? '',
    statut: plant?.statut && plant.statut !== 'Vide' ? plant.statut : 'Semis',
    notes: plant?.notes ?? '',
  })

  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({
      id_type: form.id_type ? Number(form.id_type) : null,
      date_semis: form.date_semis || null,
      date_plantation: form.date_plantation || null,
      date_recolte_prevue: form.date_recolte_prevue || null,
      quantite: form.quantite !== '' ? Number(form.quantite) : null,
      unite_quantite: form.unite_quantite || null,
      statut: form.statut,
      notes: form.notes || null,
    })
  }

  const inputClass =
    'bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-cyan-500/50'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-gray-400">Type de culture</span>
          <select value={form.id_type} onChange={(e) => handleChange('id_type', e.target.value)} className={inputClass}>
            <option value="">— Choisir —</option>
            {types?.map((t) => (
              <option key={t.id_type} value={t.id_type}>
                {t.nom}{t.variete ? ` (${t.variete})` : ''}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-gray-400">Statut</span>
          <select value={form.statut} onChange={(e) => handleChange('statut', e.target.value)} className={inputClass}>
            {STATUTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-gray-400">Date de semis</span>
          <input type="date" value={form.date_semis ?? ''} onChange={(e) => handleChange('date_semis', e.target.value)} className={inputClass} />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-gray-400">Date de plantation</span>
          <input type="date" value={form.date_plantation ?? ''} onChange={(e) => handleChange('date_plantation', e.target.value)} className={inputClass} />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-gray-400">Récolte prévue</span>
          <input type="date" value={form.date_recolte_prevue ?? ''} onChange={(e) => handleChange('date_recolte_prevue', e.target.value)} className={inputClass} />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-gray-400">Quantité</span>
          <input type="number" step="0.001" value={form.quantite} onChange={(e) => handleChange('quantite', e.target.value)} className={inputClass} />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-gray-400">Unité</span>
          <input type="text" value={form.unite_quantite} onChange={(e) => handleChange('unite_quantite', e.target.value)} placeholder="unite, kg..." className={inputClass} />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-gray-400">Notes</span>
        <textarea value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} rows={2} className={`${inputClass} resize-none`} />
      </label>

      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors">
          Annuler
        </button>
        <button type="submit" disabled={isSaving} className="px-4 py-2 rounded-lg border border-cyan-500/50 bg-cyan-500/10 text-cyan-300 font-medium hover:bg-cyan-500/20 transition-colors disabled:opacity-50">
          {isSaving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}