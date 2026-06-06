import { useState } from 'react'
import useAuth from '../../features/auth/hook/useAuth'
import '../styles/layout.scss'

const Navbar = () => {
  const { user, LogoutUser } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = () => {
    LogoutUser()
    setShowDropdown(false)
  }

  return (
    <header className="navbar">
      <div className="navbar__container">
        <div className="navbar__spacer"></div>

        <div className="navbar__right">
          <div className="navbar__notifications">
            <button className="notification-btn" title="Notifications">
              🔔
              <span className="notification-badge">3</span>
            </button>
          </div>

          <div className="navbar__user">
            <button
              className="user-btn"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="user-avatar">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <span className="user-name">{user?.name || 'User'}</span>
              <span className="dropdown-arrow">▼</span>
            </button>

            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-item">
                  <strong>{user?.name}</strong>
                  <p className="text-muted">{user?.email}</p>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item dropdown-item--danger" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
