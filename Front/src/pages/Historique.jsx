// Deux historiques disponibles :
// - "Plantations" : construit à partir des vraies données /api/plants et /api/types
// - "Système" : fakeHistoriqueEvenements/Mesures, en attendant les routes BACK
//   du module supervision arrosage (pas encore disponibles côté Dewi)

import React, { useState } from 'react'
import Card from '../components/Card'
import { Search } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import PlantStatusBadge from '../components/PlantStatusBadge'
import PlantDetailCard from '../components/PlantDetailCard'
import { usePlants } from '../hooks/usePlants'
import { useTypes } from '../hooks/useTypes'
import { fakeHistoriqueEvenements, fakeHistoriqueMesures } from '../mocks/fakeData'

function buildPlantEvents(plants, types) {
  const events = []

  for (const plant of plants) {
    const type = types?.find((t) => t.id_type === plant.id_type) ?? null
    const typeName = type ? type.nom : null

    if (plant.date_semis) {
      events.push({
        id: `${plant.id_plant}-semis`,
        date: plant.date_semis,
        label: `Semis${typeName ? ` — ${typeName}` : ''}`,
        idPlant: plant.id_plant,
        statut: plant.statut,
      })
    }
    if (plant.date_plantation) {
      events.push({
        id: `${plant.id_plant}-plantation`,
        date: plant.date_plantation,
        label: `Plantation${typeName ? ` — ${typeName}` : ''}`,
        idPlant: plant.id_plant,
        statut: plant.statut,
      })
    }
    if (plant.date_recolte_prevue) {
      events.push({
        id: `${plant.id_plant}-recolte`,
        date: plant.date_recolte_prevue,
        label: `Récolte prévue${typeName ? ` — ${typeName}` : ''}`,
        idPlant: plant.id_plant,
        statut: plant.statut,
      })
    }
  }

  return events.sort((a, b) => a.date.localeCompare(b.date))
}

const TABS = [
  { id: 'plantations', label: 'Plantations' },
  { id: 'systeme', label: 'Système (données fictives)' },
]

export default function Historique() {
  const [activeTab, setActiveTab] = useState('plantations')
  const [search, setSearch] = useState('')
  const [selectedEventId, setSelectedEventId] = useState(null)
  const { data: plants, isLoading: plantsLoading, isError: plantsError } = usePlants()
  const { data: types } = useTypes()

  const plantEvents = plants
    ? buildPlantEvents(plants, types).filter((event) =>
        `${event.label} ${event.statut} #${event.idPlant}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : []

  const filteredFakeEvents = fakeHistoriqueEvenements.filter((event) =>
    event.message.toLowerCase().includes(search.toLowerCase())
  )
  const filteredFakeMesures = fakeHistoriqueMesures.filter((mesure) =>
    `${mesure.label} ${mesure.status}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-100">Historique</h1>

      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                : 'bg-gray-900 text-gray-300 border-gray-700 hover:border-cyan-500/40 hover:text-cyan-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher (variété, événement, statut...)"
          className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
        />
      </div>

      {activeTab === 'plantations' ? (
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-200">Cycle de vie des plantations</h2>

          {plantsLoading ? <p className="text-gray-400">Chargement...</p> : null}
          {plantsError ? <p className="text-red-400">Impossible de charger l'historique.</p> : null}

          {plants ? (
            <Card className="p-0 overflow-x-auto">
              <table className="w-full text-left min-w-[500px]">
                <thead className="bg-gray-800/60">
                  <tr>
                    <th className="p-3 text-gray-300">Date</th>
                    <th className="p-3 text-gray-300">Événement</th>
                    <th className="p-3 text-gray-300">Emplacement</th>
                    <th className="p-3 text-gray-300">Statut actuel</th>
                  </tr>
                </thead>
                <tbody>
                  {plantEvents.map((event) => {
                    const isSelected = selectedEventId === event.id
                    const eventPlant = isSelected
                      ? plants?.find((p) => p.id_plant === event.idPlant) ?? null
                      : null
                    const eventType = eventPlant
                      ? types?.find((t) => t.id_type === eventPlant.id_type) ?? null
                      : null

                    return (
                      <React.Fragment key={event.id}>
                        <tr
                          onClick={() => setSelectedEventId(isSelected ? null : event.id)}
                          className={`border-t border-gray-800 cursor-pointer transition-colors hover:bg-gray-800/40 ${
                            isSelected ? 'bg-cyan-500/10' : ''
                          }`}
                        >
                          <td className="p-3 text-sm text-gray-400">{event.date}</td>
                          <td className="p-3 text-gray-100">{event.label}</td>
                          <td className="p-3 text-gray-100">#{event.idPlant}</td>
                          <td className="p-3">
                            <PlantStatusBadge statut={event.statut} />
                          </td>
                        </tr>
                        {isSelected && eventPlant ? (
                          <tr className="border-t border-gray-800 bg-gray-900/60">
                            <td colSpan={4} className="p-4">
                              <PlantDetailCard plant={eventPlant} type={eventType} />
                            </td>
                          </tr>
                        ) : null}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </Card>
          ) : null}
        </section>
      ) : null}

      {activeTab === 'systeme' ? (
        <div className="flex flex-col gap-8">
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-gray-200">Événements</h2>
            <Card className="p-0 overflow-x-auto">
              <table className="w-full text-left min-w-[500px]">
                <thead className="bg-gray-800/60">
                  <tr>
                    <th className="p-3 text-gray-300">Date</th>
                    <th className="p-3 text-gray-300">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFakeEvents.map((event) => (
                    <tr key={event.id} className="border-t border-gray-800">
                      <td className="p-3 text-sm text-gray-400">{event.date}</td>
                      <td className="p-3 text-gray-100">{event.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-gray-200">Mesures</h2>
            <Card className="p-0 overflow-x-auto">
              <table className="w-full text-left min-w-[500px]">
                <thead className="bg-gray-800/60">
                  <tr>
                    <th className="p-3 text-gray-300">Date</th>
                    <th className="p-3 text-gray-300">Mesure</th>
                    <th className="p-3 text-gray-300">Valeur</th>
                    <th className="p-3 text-gray-300">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFakeMesures.map((mesure) => (
                    <tr key={mesure.id} className="border-t border-gray-800">
                      <td className="p-3 text-sm text-gray-400">{mesure.date}</td>
                      <td className="p-3 text-gray-100">{mesure.label}</td>
                      <td className="p-3 text-gray-100">
                        {mesure.status === 'MISSING' || mesure.status === 'STALE'
                          ? '—'
                          : `${mesure.value}${mesure.unit}`}
                      </td>
                      <td className="p-3">
                        <StatusBadge status={mesure.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </section>
        </div>
      ) : null}
    </div>
  )
}