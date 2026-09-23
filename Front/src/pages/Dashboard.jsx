// ⚠️ Utilise fakeDashboardState (données fictives temporaires) en attendant
// le branchement sur useSystemState() une fois le contrat d'API figé avec Dewi.

import MeasureCard from '../components/MeasureCard'
import StatusBadge from '../components/StatusBadge'
import Gauge from '../components/Gauge'
import { fakeDashboardState } from '../mocks/fakeData'

export default function Dashboard() {
  const {
    niveau,
    temperature,
    pompe,
    etatGlobal,
    dernierEvenement,
    prochainCycle,
    mode,
  } = fakeDashboardState

  return (
    <div className="p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="border border-gray-300 rounded-lg p-4">
          <Gauge label="Niveau" value={niveau.value} unit={niveau.unit} status={niveau.status} />
        </div>

        <MeasureCard
          label="Température"
          value={temperature.value}
          unit={temperature.unit}
          status={temperature.status}
        />

        <div className="border border-gray-300 rounded-lg p-4 flex flex-col gap-2">
          <span className="text-sm text-gray-500">État de la pompe</span>
          <StatusBadge status={pompe} />
        </div>

        <div className="border border-gray-300 rounded-lg p-4 flex flex-col gap-2">
          <span className="text-sm text-gray-500">État global</span>
          <StatusBadge status={etatGlobal} />
        </div>

        <div className="border border-gray-300 rounded-lg p-4 flex flex-col gap-2">
          <span className="text-sm text-gray-500">Dernier événement</span>
          <span className="text-base font-medium">{dernierEvenement}</span>
        </div>

        <div className="border border-gray-300 rounded-lg p-4 flex flex-col gap-2">
          <span className="text-sm text-gray-500">Prochain cycle</span>
          <span className="text-base font-medium">{prochainCycle}</span>
        </div>

        <div className="border border-gray-300 rounded-lg p-4 flex flex-col gap-2">
          <span className="text-sm text-gray-500">Mode</span>
          <span className="text-base font-medium">{mode}</span>
        </div>
      </div>
    </div>
  )
}