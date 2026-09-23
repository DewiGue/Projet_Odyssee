import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, PlayCircle, History, AlertTriangle, Sprout } from 'lucide-react'
import SerreModal from './SerreModal'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/simulation', label: 'Simulation', icon: PlayCircle },
  { to: '/historique', label: 'Historique', icon: History },
  { to: '/crise', label: 'Crise', icon: AlertTriangle },
]

export default function Layout() {
  const [showSerre, setShowSerre] = useState(false)

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="bg-gray-900 border-b border-cyan-500/20 px-6 py-3 flex justify-between items-center sticky top-0 z-40">
        <nav className="flex gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setShowSerre(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cyan-500/50 text-cyan-300 font-medium hover:bg-cyan-500/10 transition-colors"
        >
          <Sprout size={18} />
          Voir la serre
        </button>
      </header>

      <main>
        <Outlet />
      </main>

      {showSerre ? <SerreModal onClose={() => setShowSerre(false)} /> : null}
    </div>
  )
}