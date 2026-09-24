import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { api } from '../api/client'
import { useSystemState } from '../hooks/useSystemState'
import { useHistory } from '../hooks/useHistory'
import Card from '../components/Card'
import Gauge from '../components/Gauge'
import StatusBadge from '../components/StatusBadge'
import SpeedControl from '../components/SpeedControl'

// Objectifs fixes du projet (§9) — pas des mesures, donc pas dans le snapshot backend.
const AUTONOMIE_CIBLE_H = 48
const RESERVE_CIBLE_PCT = 40

export default function Crise() {
  const [token, setToken] = useState('')
  const queryClient = useQueryClient()
  const { data, error, isPending } = useSystemState()
  const { data: historique } = useHistory(300)

  const mutation = useMutation({
    mutationFn: (body) => api('/simulation', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json', 'X-Simulation-Token': token },
    }),
    onSuccess: (result) => queryClient.setQueryData(['state'], result),
  })

  if (isPending) return <p className="p-6 text-gray-400">Connexion à la simulation…</p>
  if (error) return <p role="alert" className="p-6 text-red-400">Simulation indisponible : {error.message}</p>

  const sim = data.simulation
  const disabled = mutation.isPending || !token.trim()

  const tempsEcoule = sim.sim_seconds / 3600
  const tempsRestant = Math.max(AUTONOMIE_CIBLE_H - tempsEcoule, 0)

  const reserveHistorique = (historique ?? []).map((point) => ({
    heure: +(point.sim_seconds / 3600).toFixed(2),
    reserve: point.niveau,
  }))

  return (
    <div className="p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-red-500 tracking-wide">MODE CRISE</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="flex flex-col gap-2">
          <span className="text-sm text-gray-400">Autonomie cible</span>
          <span className="text-base font-medium text-gray-100">{AUTONOMIE_CIBLE_H} h</span>
        </Card>

        <Card className="flex flex-col gap-2">
          <span className="text-sm text-gray-400">Réserve cible</span>
          <span className="text-base font-medium text-gray-100">{RESERVE_CIBLE_PCT} %</span>
        </Card>

        <Card className="flex flex-col gap-2">
          <span className="text-sm text-gray-400">Temps écoulé</span>
          <span className="text-base font-medium text-gray-100">{tempsEcoule.toFixed(2)} h</span>
        </Card>

        <Card className="flex flex-col gap-2">
          <span className="text-sm text-gray-400">Temps restant</span>
          <span className="text-base font-medium text-gray-100">{tempsRestant.toFixed(2)} h</span>
        </Card>

        <Card>
          <Gauge label="Réserve actuelle" value={data.niveau.value} unit="%" status={data.niveau.status} />
        </Card>

        <Card className="flex flex-col gap-2">
          <span className="text-sm text-gray-400">État</span>
          <StatusBadge status={data.etatGlobal} />
        </Card>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-gray-100">Évolution de la réserve</h2>
        <Card className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={reserveHistorique}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="heure" stroke="#9ca3af" label={{ value: 'Heures', position: 'insideBottom', offset: -5, fill: '#9ca3af' }} />
              <YAxis stroke="#9ca3af" label={{ value: 'Réserve (%)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #06b6d4', borderRadius: '8px', color: '#f3f4f6' }} />
              <Line type="monotone" dataKey="reserve" stroke="#22d3ee" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </section>

      <label className="flex flex-col gap-2 max-w-xl text-gray-300">
        Jeton de commande
        <input
          className="bg-gray-900 border border-gray-700 rounded-lg p-2 text-gray-100"
          type="password" autoComplete="off" value={token}
          onChange={(e) => setToken(e.target.value)} placeholder="Colle le jeton ici"
        />
      </label>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-gray-100">Vitesse de simulation</h2>
        <SpeedControl
          speed={sim.speed}
          onSpeedChange={(speed) => !disabled && mutation.mutate({ action: 'speed', value: speed })}
          onAdvance={() => { if (!disabled && sim.paused) mutation.mutate({ action: 'step' }) }}
        />
      </section>

      {mutation.error && <p role="alert" className="text-red-400">{mutation.error.message}</p>}
    </div>
  )
}