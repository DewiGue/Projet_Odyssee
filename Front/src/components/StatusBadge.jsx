const STATUS_STYLES = {
  ARRÊT: 'bg-gray-100 text-gray-700 border-gray-300',
  ATTENTE: 'bg-blue-100 text-blue-700 border-blue-300',
  ARROSAGE: 'bg-green-100 text-green-700 border-green-300',
  DÉFAUT: 'bg-red-100 text-red-700 border-red-300',
  MISSING: 'bg-gray-100 text-gray-400 border-gray-300',
  STALE: 'bg-yellow-100 text-yellow-700 border-yellow-300',
}

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-700 border-gray-300'

  return (
    <span className={`inline-block px-3 py-1 rounded-full border text-sm font-medium ${style}`}>
      {status}
    </span>
  )
}