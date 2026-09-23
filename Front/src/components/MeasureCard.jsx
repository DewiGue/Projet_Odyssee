import Card from './Card'
import StatusBadge from './StatusBadge'

export default function MeasureCard({ label, value, unit, status }) {
  const isUnavailable = status === 'MISSING' || status === 'STALE'

  return (
    <Card className="flex flex-col gap-2">
      <span className="text-sm text-gray-400">{label}</span>

      <span className="text-2xl font-semibold text-gray-100">
        {isUnavailable ? '—' : value}
        {!isUnavailable && unit ? <span className="text-base font-normal text-gray-400 ml-1">{unit}</span> : null}
      </span>

      {status ? <StatusBadge status={status} /> : null}
    </Card>
  )
}