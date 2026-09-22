// ⚠️ Tranches de niveau définies par Jordan (pas issues du contrat d'API/Dewi).
// À confirmer/valider si ces seuils doivent correspondre à une vraie logique métier.
import StatusBadge from './StatusBadge'

const LEVEL_THRESHOLDS = [
  { max: 40, label: 'Critique', color: 'bg-red-500', textColor: 'text-red-700' },
  { max: 60, label: 'Mise à niveau à faire', color: 'bg-orange-400', textColor: 'text-orange-700' },
  { max: 80, label: 'Satisfaisant', color: 'bg-blue-500', textColor: 'text-blue-700' },
  { max: 100, label: 'Excellent', color: 'bg-green-500', textColor: 'text-green-700' },
]

function getLevelInfo(percent) {
  return LEVEL_THRESHOLDS.find((t) => percent <= t.max) ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
}

export default function Gauge({ label, value, max = 100, unit = '%', status }) {
  const isUnavailable = status === 'MISSING' || status === 'STALE'
  const hasValue = !isUnavailable && value !== null && value !== undefined
  const percent = hasValue ? Math.min(100, Math.max(0, (value / max) * 100)) : 0
  const levelInfo = hasValue ? getLevelInfo(percent) : null

  return (
    <div className="flex flex-col gap-2 w-full">
      {label ? <span className="text-sm text-gray-500">{label}</span> : null}

      <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden border border-gray-300">
        <div
          className={`h-full transition-all ${levelInfo ? levelInfo.color : 'bg-gray-300'}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">
          {hasValue ? `${value}${unit}` : '—'}
        </span>
        {levelInfo ? (
          <span className={`text-sm font-medium ${levelInfo.textColor}`}>{levelInfo.label}</span>
        ) : null}
        {isUnavailable ? <StatusBadge status={status} /> : null}
      </div>
    </div>
  )
}