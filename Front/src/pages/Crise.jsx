// ⚠️ Utilise des données fictives temporaires (fakeCriseState, fakeReserveHistorique)
// en attendant le contrat d'API figé avec Dewi. Les contrôles de vitesse et
// "avancer la simulation" ne sont pas encore connectés à une vraie logique (console.log).

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Gauge from '../components/Gauge'
import StatusBadge from '../components/StatusBadge'
import SpeedControl from '../components/SpeedControl'
import { fakeCriseState, fakeReserveHistorique } from '../mocks/fakeData'

export default function Crise() {
  const [speed, setSpeed] = useState(1)
  const {
    autonomieCible,
    reserveCible,
    tempsEcoule,
    tempsRestant,
    reserveActuelle,
    etat,
  } = fakeCriseState

  function handleAdvance() {
    // TODO: remplacer par un vrai appel API une fois le contrat figé avec Dewi
    console.log('Avancer la simulation (mode crise), vitesse actuelle :', speed)
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-red-600">MODE CRISE</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="border border-gray-300 rounded-lg p-4 flex flex-col gap-2">
          <span className="text-sm text-gray-500">Autonomie cible</span>
          <span className="text-base font-medium">{autonomieCible} h</span>
        </div>

        <div className="border border-gray-300 rounded-lg p-4 flex flex-col gap-2">
          <span className="text-sm text-gray-500">Réserve cible</span>
          <span className="text-base font-medium">{reserveCible} %</span>
        </div>

        <div className="border border-gray-300 rounded-lg p-4 flex flex-col gap-2">
          <span className="text-sm text-gray-500">Temps écoulé</span>
          <span className="text-base font-medium">{tempsEcoule} h</span>
        </div>

        <div className="border border-gray-300 rounded-lg p-4 flex flex-col gap-2">
          <span className="text-sm text-gray-500">Temps restant</span>
          <span className="text-base font-medium">{tempsRestant} h</span>
        </div>

        <div className="border border-gray-300 rounded-lg p-4">
          <Gauge label="Réserve actuelle" value={reserveActuelle} unit="%" />
        </div>

        <div className="border border-gray-300 rounded-lg p-4 flex flex-col gap-2">
          <span className="text-sm text-gray-500">État</span>
          <StatusBadge status={etat} />
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Évolution de la réserve</h2>
        <div className="border border-gray-300 rounded-lg p-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={fakeReserveHistorique}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="heure" label={{ value: 'Heures', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Réserve (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Line type="monotone" dataKey="reserve" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Vitesse de simulation</h2>
        <SpeedControl speed={speed} onSpeedChange={setSpeed} onAdvance={handleAdvance} />
      </section>
    </div>
  )
}