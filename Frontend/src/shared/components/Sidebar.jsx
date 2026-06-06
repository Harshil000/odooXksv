import { Link, useLocation } from 'react-router'
import '../styles/layout.scss'

const Sidebar = () => {
  const location = useLocation()

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Vendors', path: '/vendors', icon: '🏢' },
    { label: 'RFQs', path: '/rfqs', icon: '📋' },
    { label: 'Quotations', path: '/quotations', icon: '💰' },
    { label: 'Approvals', path: '/approvals', icon: '✓' },
    { label: 'Purchase Orders', path: '/purchase-orders', icon: '📦' },
    { label: 'Invoices', path: '/invoices', icon: '🧾' },
    { label: 'Reports', path: '/reports', icon: '📈' },
    { label: 'Activity', path: '/activity', icon: '🕐' },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <h2>VendorBridge</h2>
      </div>

      <nav className="sidebar__nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'nav-link--active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar__footer">
        <p className="version">v1.0.0</p>
      </div>
    </aside>
  )
}

export default Sidebar
