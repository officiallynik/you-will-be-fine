import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/', icon: '🏠', label: 'Home' },
  { path: '/breathe', icon: '🌬️', label: 'Breathe' },
  { path: '/ground', icon: '🌿', label: 'Ground' },
  { path: '/reframe', icon: '💭', label: 'Reframe' },
  { path: '/journal', icon: '📖', label: 'Journal' },
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav className="bottom-nav">
      {navItems.map(item => {
        const active = location.pathname === item.path
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${active ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
