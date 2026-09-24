import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, PlayCircle, History, AlertTriangle, Sprout, Menu, X } from 'lucide-react'
import SerreModal from './SerreModal'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/simulation', label: 'Simulation', icon: PlayCircle },
  { to: '/historique', label: 'Historique', icon: History },
  { to: '/crise', label: 'Crise', icon: AlertTriangle },
]

export default function Layout() {
  const [showSerre, setShowSerre] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="bg-gray-900 border-b border-cyan-500/20 px-4 sm:px-6 py-3 flex justify-between items-center sticky top-0 z-40">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="md:hidden text-gray-300 hover:text-cyan-300 transition-colors"
        >
          <Menu size={26} />
        </button>

        <nav className="hidden md:flex gap-1">
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
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-cyan-500/50 text-cyan-300 font-medium hover:bg-cyan-500/10 transition-colors text-sm sm:text-base"
        >
          <Sprout size={18} />
          <span className="hidden sm:inline">Voir la serre</span>
        </button>
      </header>

      {/* Overlay + tiroir de navigation mobile */}
      {menuOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <nav className="absolute left-0 top-0 h-full w-64 bg-gray-900 border-r border-cyan-500/30 p-4 flex flex-col gap-2 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-cyan-300 font-semibold tracking-wide">MENU</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="text-gray-400 hover:text-cyan-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
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
        </div>
      ) : null}

      <main>
        <Outlet />
      </main>

      {showSerre ? <SerreModal onClose={() => setShowSerre(false)} /> : null}
    </div>
  )
}