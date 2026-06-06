import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import useAuth from '../features/auth/hook/useAuth'
import './dashboard.scss'

function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    pendingApprovals: 5,
    activeRFQs: 12,
    recentPOs: 8,
    recentInvoices: 15,
  })

  if (!user) return null

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1 className="dashboard__title">Welcome back, {user.name}!</h1>
          <p className="dashboard__subtitle">Here's your procurement overview</p>
        </div>
        <div className="user-role-badge">{user.role}</div>
      </div>

      {/* Analytics Cards */}
      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="card-icon">📋</div>
          <div className="card-content">
            <h3>Pending Approvals</h3>
            <p className="card-value">{stats.pendingApprovals}</p>
            <Link to="/approvals" className="card-link">View Details →</Link>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon">📋</div>
          <div className="card-content">
            <h3>Active RFQs</h3>
            <p className="card-value">{stats.activeRFQs}</p>
            <Link to="/rfqs" className="card-link">View All →</Link>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon">📦</div>
          <div className="card-content">
            <h3>Recent POs</h3>
            <p className="card-value">{stats.recentPOs}</p>
            <Link to="/purchase-orders" className="card-link">View Orders →</Link>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon">🧾</div>
          <div className="card-content">
            <h3>Recent Invoices</h3>
            <p className="card-value">{stats.recentInvoices}</p>
            <Link to="/invoices" className="card-link">View Invoices →</Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/rfqs" className="action-button action-button--primary">
            <span className="action-icon">➕</span>
            <span>Create RFQ</span>
          </Link>
          <Link to="/vendors" className="action-button action-button--secondary">
            <span className="action-icon">👥</span>
            <span>Manage Vendors</span>
          </Link>
          <Link to="/quotations" className="action-button action-button--secondary">
            <span className="action-icon">💰</span>
            <span>View Quotations</span>
          </Link>
          <Link to="/reports" className="action-button action-button--secondary">
            <span className="action-icon">📈</span>
            <span>View Reports</span>
          </Link>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-dot"></div>
            <div className="activity-content">
              <p className="activity-title">RFQ approved by Manager</p>
              <p className="activity-time">2 hours ago</p>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-dot"></div>
            <div className="activity-content">
              <p className="activity-title">New quotation received from Vendor A</p>
              <p className="activity-time">4 hours ago</p>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-dot"></div>
            <div className="activity-content">
              <p className="activity-title">Invoice #INV-2025-001 generated</p>
              <p className="activity-time">1 day ago</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
