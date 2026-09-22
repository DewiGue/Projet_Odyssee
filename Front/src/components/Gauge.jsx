export default function Gauge({ label, value, max = 100, unit = '%' }) {
  const hasValue = value !== null && value !== undefined
  const percent = hasValue ? Math.min(100, Math.max(0, (value / max) * 100)) : 0

  return (
    <div className="flex flex-col gap-2 w-full">
      {label ? <span className="text-sm text-gray-500">{label}</span> : null}

      <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden border border-gray-300">
        <div
          className="h-full bg-blue-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <span className="text-sm font-medium">
        {hasValue ? `${value}${unit}` : '—'}
      </span>
    </div>
  )
}