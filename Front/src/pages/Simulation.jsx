// ⚠️ Page en cours de construction. Les scénarios ne sont pas encore connectés
// à une vraie API ou à des mocks (MSW mis de côté pour l'instant, cf. décision de Jordan).
// Les actions des boutons sont temporaires (console.log) en attendant le contrat d'API avec Dewi.

import { useState } from 'react'
import ScenarioButton from '../components/ScenarioButton'
import SpeedControl from '../components/SpeedControl'

// TODO: liste des scénarios à confirmer avec Dewi. Seul "server_down" est
// mentionné explicitement au §6 de la feuille de route.
const SCENARIOS = [
  { id: 'normal', label: 'Fonctionnement normal' },
  { id: 'server_down', label: 'Panne serveur (server_down)' },
]

export default function Simulation() {
  const [activeScenario, setActiveScenario] = useState(null)
  const [speed, setSpeed] = useState(1)

  function handleScenarioClick(scenarioId) {
    setActiveScenario(scenarioId)
    // TODO: remplacer par un vrai appel API une fois le contrat figé avec Dewi
    console.log('Scénario sélectionné :', scenarioId)
  }

  function handleAdvance() {
    // TODO: remplacer par un vrai appel API ("avancer la simulation")
    console.log('Avancer la simulation, vitesse actuelle :', speed)
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Simulation</h1>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Scénarios</h2>
        <div className="flex gap-2 flex-wrap">
          {SCENARIOS.map((scenario) => (
            <ScenarioButton
              key={scenario.id}
              label={scenario.label}
              isActive={activeScenario === scenario.id}
              onClick={() => handleScenarioClick(scenario.id)}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Vitesse de simulation</h2>
        <SpeedControl
          speed={speed}
          onSpeedChange={setSpeed}
          onAdvance={handleAdvance}
        />
      </section>
    </div>
  )
}