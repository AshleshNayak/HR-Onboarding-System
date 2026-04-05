import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import './hr-dashboard.css'

function HRDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentPage, setCurrentPage] = useState('Dashboard')

  const isActive = (path) => {
    if (path === '/hr/dashboard' && location.pathname === '/hr/dashboard') {
      return true
    }
    if (path === '/hr/candidates' && location.pathname.startsWith('/hr/candidates')) {
      return true
    }
    return location.pathname === path
  }

  const handleNavClick = (path, title) => {
    setCurrentPage(title)
    navigate(path)
  }

  const handleLogout = () => {
    localStorage.removeItem('hrAuth')
    navigate('/login')
  }

  return (
    <div className="hr-dashboard">
      {/* Sidebar */}
      <aside className="hr-sidebar">
        <div className="hr-sidebar-header">
          <h1 className="hr-app-name">HR Onboard</h1>
        </div>

        <nav className="hr-nav">
          <button
            className={`hr-nav-item ${isActive('/hr/dashboard') ? 'active' : ''}`}
            onClick={() => handleNavClick('/hr/dashboard', 'Dashboard')}
          >
            <span className="hr-nav-icon">📊</span>
            <span>Dashboard</span>
          </button>
          <button
            className={`hr-nav-item ${isActive('/hr/candidates') ? 'active' : ''}`}
            onClick={() => handleNavClick('/hr/candidates', 'Candidates')}
          >
            <span className="hr-nav-icon">👥</span>
            <span>Candidates</span>
          </button>
          <button
            className={`hr-nav-item ${isActive('/hr/forms-review') ? 'active' : ''}`}
            onClick={() => handleNavClick('/hr/forms-review', 'Forms Review')}
          >
            <span className="hr-nav-icon">📋</span>
            <span>Forms Review</span>
          </button>
          <button
            className={`hr-nav-item ${isActive('/hr/reports') ? 'active' : ''}`}
            onClick={() => handleNavClick('/hr/reports', 'Reports')}
          >
            <span className="hr-nav-icon">📈</span>
            <span>Reports</span>
          </button>
        </nav>

        <div className="hr-sidebar-footer">
          <div className="hr-user-info">
            Sarah Johnson
            <div className="hr-user-role">HR Manager</div>
          </div>
          <button className="hr-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="hr-main">
        {/* Top Bar */}
        <header className="hr-topbar">
          <h2 className="hr-topbar-title">{currentPage}</h2>
          <div className="hr-topbar-right">
            <input
              type="text"
              className="hr-search-input"
              placeholder="Search candidates..."
            />
            <span className="hr-bell-icon">🔔</span>
            <div className="hr-avatar">SJ</div>
          </div>
        </header>

        {/* Content Area */}
        <main className="hr-content">
          {location.pathname === '/hr/dashboard' ? (
            <DashboardHome />
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  )
}

function DashboardHome() {
  // TODO: Replace with API call
  return (
    <div className="hr-stats-grid">
      <div className="hr-stat-card blue">
        <div className="hr-stat-icon">👥</div>
        <div className="hr-stat-value">24</div>
        <div className="hr-stat-label">Total Candidates</div>
      </div>
      <div className="hr-stat-card yellow">
        <div className="hr-stat-icon">⏳</div>
        <div className="hr-stat-value">8</div>
        <div className="hr-stat-label">Pending Review</div>
      </div>
      <div className="hr-stat-card green">
        <div className="hr-stat-icon">✅</div>
        <div className="hr-stat-value">6</div>
        <div className="hr-stat-label">Fully Completed</div>
      </div>
      <div className="hr-stat-card teal">
        <div className="hr-stat-icon">🎯</div>
        <div className="hr-stat-value">4</div>
        <div className="hr-stat-label">Approved & Ready</div>
      </div>
    </div>
  )
}

export default HRDashboard
