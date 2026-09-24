import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'
import { useSystemState } from '../hooks/useSystemState'
import ScenarioButton from '../components/ScenarioButton'
import SpeedControl from '../components/SpeedControl'

const SCENARIOS = [
  { id: 'normal', label: 'Fonctionnement normal' },
  { id: 'pump_failure', label: 'Panne de pompe' },
  { id: 'low_level', label: 'Niveau bas (30 %)' },
]

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
          onAdvance={() => {
            if (!disabled && sim.paused) send('step')
          }}
        />
        <button
          type="button" disabled={disabled}
          className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 self-start disabled:opacity-40 hover:bg-gray-800"
          onClick={() => send(sim.paused ? 'resume' : 'pause')}
        >
          {sim.paused ? 'Reprendre' : 'Mettre en pause'}
        </button>
      </section>

      {mutation.error && <p role="alert" className="text-red-400">{mutation.error.message}</p>}
    </div>
  )
}