// ⚠️ Utilise fakeDashboardState (données fictives temporaires) en attendant
// le branchement sur useSystemState() une fois le contrat d'API figé avec Dewi.

import Card from '../components/Card'
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
      <h1 className="text-2xl font-bold text-gray-100">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <Gauge label="Niveau d'eau" value={niveau.value} unit={niveau.unit} status={niveau.status} />
        </Card>

        <MeasureCard
          label="Température"
          value={temperature.value}
          unit={temperature.unit}
          status={temperature.status}
        />

        <Card className="flex flex-col gap-2">
          <span className="text-sm text-gray-400">État de la pompe</span>
          <StatusBadge status={pompe} />
        </Card>

        <Card className="flex flex-col gap-2">
          <span className="text-sm text-gray-400">État global</span>
          <StatusBadge status={etatGlobal} />
        </Card>

        <Card className="flex flex-col gap-2">
          <span className="text-sm text-gray-400">Dernier événement</span>
          <span className="text-base font-medium text-gray-100">{dernierEvenement}</span>
        </Card>

        <Card className="flex flex-col gap-2">
          <span className="text-sm text-gray-400">Prochain cycle</span>
          <span className="text-base font-medium text-gray-100">{prochainCycle}</span>
        </Card>

        <Card className="flex flex-col gap-2">
          <span className="text-sm text-gray-400">Mode</span>
          <span className="text-base font-medium text-gray-100">{mode}</span>
        </Card>
      </div>
    </div>
  )
}