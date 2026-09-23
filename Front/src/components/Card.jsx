export default function Card({ children, className = '' }) {
  return (
    <div
      className={`bg-gray-900 border border-cyan-500/20 rounded-xl p-4 hover:border-cyan-500/40 transition-colors ${className}`}
    >
      {children}
    </div>
  )
}