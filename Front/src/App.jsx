import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Simulation from './pages/Simulation'
import Historique from './pages/Historique'
import Crise from './pages/Crise'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="simulation" element={<Simulation />} />
        <Route path="historique" element={<Historique />} />
        <Route path="crise" element={<Crise />} />
      </Route>
    </Routes>
  )
}

export default App