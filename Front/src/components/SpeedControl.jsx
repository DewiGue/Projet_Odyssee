const SPEEDS = [1, 60, 600, 3600]

export default function SpeedControl({ speed, onSpeedChange, onAdvance }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        {SPEEDS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSpeedChange(s)}
            className={`px-3 py-1 rounded-lg border font-medium transition-colors ${
              speed === s
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            ×{s}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onAdvance}
        className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 self-start"
      >
        Avancer la simulation
      </button>
    </div>
  )
}