// ⚠️ Utilise des données fictives temporaires (fakeCriseState, fakeReserveHistorique)
// en attendant le contrat d'API figé avec Dewi. Les contrôles de vitesse et
// "avancer la simulation" ne sont pas encore connectés à une vraie logique (console.log).

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Card from '../components/Card'
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
      <h1 className="text-2xl font-bold text-red-500 tracking-wide">MODE CRISE</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="flex flex-col gap-2">
          <span className="text-sm text-gray-400">Autonomie cible</span>
          <span className="text-base font-medium text-gray-100">{autonomieCible} h</span>
        </Card>

        <Card className="flex flex-col gap-2">
          <span className="text-sm text-gray-400">Réserve cible</span>
          <span className="text-base font-medium text-gray-100">{reserveCible} %</span>
        </Card>

        <Card className="flex flex-col gap-2">
          <span className="text-sm text-gray-400">Temps écoulé</span>
          <span className="text-base font-medium text-gray-100">{tempsEcoule} h</span>
        </Card>

        <Card className="flex flex-col gap-2">
          <span className="text-sm text-gray-400">Temps restant</span>
          <span className="text-base font-medium text-gray-100">{tempsRestant} h</span>
        </Card>

        <Card>
          <Gauge label="Réserve actuelle" value={reserveActuelle} unit="%" />
        </Card>

        <Card className="flex flex-col gap-2">
          <span className="text-sm text-gray-400">État</span>
          <StatusBadge status={etat} />
        </Card>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-gray-100">Évolution de la réserve</h2>
        <Card className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={fakeReserveHistorique}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="heure" stroke="#9ca3af" label={{ value: 'Heures', position: 'insideBottom', offset: -5, fill: '#9ca3af' }} />
              <YAxis stroke="#9ca3af" label={{ value: 'Réserve (%)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #06b6d4', borderRadius: '8px', color: '#f3f4f6' }} />
              <Line type="monotone" dataKey="reserve" stroke="#22d3ee" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-gray-100">Vitesse de simulation</h2>
        <SpeedControl speed={speed} onSpeedChange={setSpeed} onAdvance={handleAdvance} />
      </section>
    </div>
  )
}