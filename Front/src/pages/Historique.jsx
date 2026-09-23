// ⚠️ Utilise des données fictives temporaires (fakeHistoriqueEvenements, fakeHistoriqueMesures)
// en attendant le contrat d'API figé avec Dewi. Le polling réel (useQuery avec refetchInterval)
// sera branché une fois l'endpoint /api/historique (ou équivalent) défini avec Dewi.

import Card from '../components/Card'
import { fakeHistoriqueEvenements, fakeHistoriqueMesures } from '../mocks/fakeData'
import StatusBadge from '../components/StatusBadge'

export default function Historique() {
  return (
    <div className="p-6 flex flex-col gap-8">
      <h1 className="text-2xl font-bold text-gray-100">Historique</h1>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-gray-200">Événements</h2>
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-800/60">
              <tr>
                <th className="p-3 text-gray-300">Date</th>
                <th className="p-3 text-gray-300">Message</th>
              </tr>
            </thead>
            <tbody>
              {fakeHistoriqueEvenements.map((event) => (
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
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-800/60">
              <tr>
                <th className="p-3 text-gray-300">Date</th>
                <th className="p-3 text-gray-300">Mesure</th>
                <th className="p-3 text-gray-300">Valeur</th>
                <th className="p-3 text-gray-300">Statut</th>
              </tr>
            </thead>
            <tbody>
              {fakeHistoriqueMesures.map((mesure) => (
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
  )
}