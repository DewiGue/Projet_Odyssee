// ⚠️ Utilise des données fictives temporaires (fakeHistoriqueEvenements, fakeHistoriqueMesures)
// en attendant le contrat d'API figé avec Dewi. Le polling réel (useQuery avec refetchInterval)
// sera branché une fois l'endpoint /api/historique (ou équivalent) défini avec Dewi.

import { fakeHistoriqueEvenements, fakeHistoriqueMesures } from '../mocks/fakeData'
import StatusBadge from '../components/StatusBadge'

export default function Historique() {
  return (
    <div className="p-6 flex flex-col gap-8">
      <h1 className="text-2xl font-bold">Historique</h1>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Événements</h2>
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2">Message</th>
            </tr>
          </thead>
          <tbody>
            {fakeHistoriqueEvenements.map((event) => (
              <tr key={event.id} className="border-t border-gray-200">
                <td className="p-2 text-sm text-gray-500">{event.date}</td>
                <td className="p-2">{event.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Mesures</h2>
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2">Mesure</th>
              <th className="p-2">Valeur</th>
              <th className="p-2">Statut</th>
            </tr>
          </thead>
          <tbody>
            {fakeHistoriqueMesures.map((mesure) => (
              <tr key={mesure.id} className="border-t border-gray-200">
                <td className="p-2 text-sm text-gray-500">{mesure.date}</td>
                <td className="p-2">{mesure.label}</td>
                <td className="p-2">
                  {mesure.status === 'MISSING' || mesure.status === 'STALE'
                    ? '—'
                    : `${mesure.value}${mesure.unit}`}
                </td>
                <td className="p-2">
                  <StatusBadge status={mesure.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}