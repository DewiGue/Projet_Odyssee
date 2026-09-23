const STATUS_STYLES = {
  ARRÊT: 'bg-gray-500/10 text-gray-300 border-gray-500/40',
  ATTENTE: 'bg-blue-500/10 text-blue-300 border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.3)]',
  ARROSAGE: 'bg-green-500/10 text-green-300 border-green-500/40 shadow-[0_0_10px_rgba(34,197,94,0.3)]',
  DÉFAUT: 'bg-red-500/10 text-red-300 border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.3)]',
  MISSING: 'bg-gray-500/10 text-gray-400 border-gray-500/40',
  STALE: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/40 shadow-[0_0_10px_rgba(234,179,8,0.3)]',
}

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? 'bg-gray-500/10 text-gray-300 border-gray-500/40'

  return (
    <span className={`inline-block px-3 py-1 rounded-full border text-sm font-medium ${style}`}>
      {status}
    </span>
  )
}