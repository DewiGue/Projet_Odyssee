import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'
import { useSystemState } from '../hooks/useSystemState'
import Card from '../components/Card'
import MeasureCard from '../components/MeasureCard'
import Gauge from '../components/Gauge'
import StatusBadge from '../components/StatusBadge'
import ScenarioButton from '../components/ScenarioButton'
import SpeedControl from '../components/SpeedControl'

const SCENARIOS = [
  { id: 'normal', label: 'Fonctionnement normal' },
  { id: 'pump_failure', label: 'Panne de pompe' },
  { id: 'low_level', label: 'Niveau bas (30 %)' },
]

const buttonClass =
  'px-4 py-2 rounded-lg border border-gray-700 text-gray-300 disabled:opacity-40 hover:bg-gray-800 transition-colors'

export default function Simulation() {
  const [token, setToken] = useState('')
  const queryClient = useQueryClient()
  const { data, error, isPending } = useSystemState()

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
  const send = (action, value) => mutation.mutate({ action, ...(value === undefined ? {} : { value }) })

  return (
    <div className="p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-100">Simulation</h1>

      {/* Mesures en direct — mêmes composants et mêmes champs que le Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <Gauge label="Niveau d'eau" value={data.niveau.value} unit={data.niveau.unit} status={data.niveau.status} />
        </Card>
        <MeasureCard label="Température" value={data.temperature.value} unit={data.temperature.unit} status={data.temperature.status} />
        <MeasureCard label="pH" value={data.ph.value} unit={data.ph.unit} status={data.ph.status} />
        <MeasureCard label="EC" value={data.ec.value} unit={data.ec.unit} status={data.ec.status} />
        <MeasureCard label="Débit" value={data.debit.value} unit={data.debit.unit} status={data.debit.status} />
        <MeasureCard label="Pression" value={data.pression.value} unit={data.pression.unit} status={data.pression.status} />
        <Card className="flex flex-col gap-2">
          <span className="text-sm text-gray-400">État de la pompe</span>
          <StatusBadge status={data.pompe} />
        </Card>
        <Card className="flex flex-col gap-2">
          <span className="text-sm text-gray-400">État global</span>
          <StatusBadge status={data.etatGlobal} />
        </Card>
        <Card className="flex flex-col gap-2">
          <span className="text-sm text-gray-400">Dernier événement</span>
          <span className="text-base font-medium text-gray-100">{data.dernierEvenement}</span>
        </Card>
      </div>

      {data.alerts?.length > 0 && (
        <Card className="flex flex-col gap-1 border-red-500/40">
          <span className="text-sm text-red-400 font-medium">Alertes</span>
          {data.alerts.map((a) => <span key={a} className="text-sm text-gray-300">{a}</span>)}
        </Card>
      )}

      {/* Jeton de commande */}
      <label className="flex flex-col gap-2 max-w-xl text-gray-300">
        Jeton de commande
        <input
          className="bg-gray-900 border border-gray-700 rounded-lg p-2 text-gray-100"
          type="password" autoComplete="off" value={token}
          onChange={(e) => setToken(e.target.value)} placeholder="Colle le jeton ici"
        />
      </label>

      <p className="text-gray-400">
        Temps simulé : {sim.sim_seconds} s · {sim.paused ? 'En pause' : 'En cours'}
      </p>

      {/* Contrôles */}
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-gray-200">Scénarios</h2>
        <div className="flex gap-2 flex-wrap">
          {SCENARIOS.map((s) => (
            <ScenarioButton key={s.id} label={s.label} isActive={sim.scenario === s.id}
              onClick={() => !disabled && send('scenario', s.id)} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-gray-200">Vitesse de simulation</h2>
        <SpeedControl
          speed={sim.speed}
          onSpeedChange={(speed) => !disabled && send('speed', speed)}
          onAdvance={() => { if (!disabled && sim.paused) send('step') }}
        />
      </section>

      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={disabled} className={buttonClass}
          onClick={() => send(sim.paused ? 'resume' : 'pause')}>
          {sim.paused ? 'Reprendre' : 'Mettre en pause'}
        </button>
        <button type="button" disabled={disabled || sim.scenario === 'pump_failure'} className={buttonClass}
          onClick={() => send('pump', !sim.pump_requested)}>
          {sim.pump_requested ? 'Arrêter la pompe' : 'Démarrer la pompe'}
        </button>
      </div>

      {mutation.error && <p role="alert" className="text-red-400">{mutation.error.message}</p>}
    </div>
  )
}