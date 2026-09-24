const PLANT_STATUS_STYLES = {
  Semis: 'bg-blue-100 text-blue-700 border-blue-300',
  Croissance: 'bg-orange-100 text-orange-700 border-orange-300',
  Récolte: 'bg-green-100 text-green-700 border-green-300',
  Malade: 'bg-red-100 text-red-700 border-red-300',
  Vide: 'bg-white text-gray-500 border-gray-300',
}

export default function PlantStatusBadge({ statut }) {
  const style = PLANT_STATUS_STYLES[statut] ?? 'bg-gray-100 text-gray-700 border-gray-300'

  return (
    <span className={`inline-block px-3 py-1 rounded-full border text-sm font-medium ${style}`}>
      {statut}
    </span>
  )
}