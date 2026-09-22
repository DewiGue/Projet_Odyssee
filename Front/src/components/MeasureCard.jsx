import StatusBadge from './StatusBadge'

export default function MeasureCard({ label, value, unit, status }) {
  const isUnavailable = status === 'MISSING' || status === 'STALE'

  return (
    <div className="border border-gray-300 rounded-lg p-4 flex flex-col gap-2">
      <span className="text-sm text-gray-500">{label}</span>

      <span className="text-2xl font-semibold">
        {isUnavailable ? '—' : value}
        {!isUnavailable && unit ? <span className="text-base font-normal text-gray-500 ml-1">{unit}</span> : null}
      </span>

      {status ? <StatusBadge status={status} /> : null}
    </div>
  )
}