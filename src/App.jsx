import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Breathe from './pages/Breathe'
import Ground from './pages/Ground'
import Reframe from './pages/Reframe'
import Journal from './pages/Journal'
import BottomNav from './components/BottomNav'

function AppContent() {
  const location = useLocation()
  const isSOS = location.pathname === '/sos'

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/breathe" element={<Breathe />} />
        <Route path="/ground" element={<Ground />} />
        <Route path="/reframe" element={<Reframe />} />
        <Route path="/journal" element={<Journal />} />
      </Routes>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
