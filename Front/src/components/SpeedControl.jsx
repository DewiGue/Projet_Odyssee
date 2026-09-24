// Vitesses prévues au §7 et §9 de la feuille de route : ×1, ×60, ×600, ×3600

const SPEEDS = [1, 60, 600, 3600]

export default function SpeedControl({ speed, onSpeedChange, onAdvance }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 flex-wrap">
        {SPEEDS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSpeedChange(s)}
            className={`px-3 py-1 rounded-lg border font-medium transition-colors ${
              speed === s
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                : 'bg-gray-900 text-gray-300 border-gray-700 hover:border-cyan-500/40 hover:text-cyan-300'
            }`}
          >
            ×{s}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onAdvance}
        className="px-4 py-2 rounded-lg border border-cyan-500/50 bg-gray-900 text-cyan-300 font-medium hover:bg-cyan-500/10 transition-colors self-start"
      >
        Avancer la simulation
      </button>
    </div>
  )
}