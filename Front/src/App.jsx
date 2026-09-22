import { Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Simulation from './pages/Simulation'
import Historique from './pages/Historique'
import Crise from './pages/Crise'

function App() {
  return (
    <div>
      <nav>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/simulation">Simulation</NavLink>
        <NavLink to="/historique">Historique</NavLink>
        <NavLink to="/crise">Crise</NavLink>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/historique" element={<Historique />} />
          <Route path="/crise" element={<Crise />} />
        </Routes>
      </main>
    </div>
  )
}

export default App