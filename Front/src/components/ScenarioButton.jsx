export default function ScenarioButton({ label, onClick, isActive = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
        isActive
          ? 'bg-blue-500 text-white border-blue-500'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  )
}