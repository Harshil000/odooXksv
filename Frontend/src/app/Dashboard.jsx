import useAuth from "../features/auth/hook/useAuth";
import { useNavigate } from "react-router";
import "../styles/dashboard.scss";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const isVendor = user.role === "VENDOR";

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">
          Welcome back, {user.name} - Today's Overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card" style={{ cursor: "pointer" }} onClick={() => navigate("/rfqs")}>
          <div className="stat-value">12</div>
          <div className="stat-label">Active RFQ's</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">5</div>
          <div className="stat-label">Pending Approvals</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">$ 2.3L</div>
          <div className="stat-label">PO's this month</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">3</div>
          <div className="stat-label">Overdue Invoices</div>
        </div>
      </div>

      {/* Content Section - Table and Chart */}
      <div className="content-section">
        {/* Recent Purchase Orders Table */}
        <div className="table-card">
          <div className="card-title">Recent Purchase Orders</div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>PO#</th>
                  <th>Vendor</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>PO-1</td>
                  <td>Infra</td>
                  <td>$7000</td>
                  <td className="status approved">Approved</td>
                </tr>
                <tr>
                  <td>PO-2</td>
                  <td>Tech care</td>
                  <td>$6000</td>
                  <td className="status pending">Pending</td>
                </tr>
                <tr>
                  <td>PO-3</td>
                  <td>Officiated co</td>
                  <td>$4400</td>
                  <td className="status draft">Draft</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart Card */}
        <div className="chart-card">
          <div className="chart-placeholder">
            <div className="chart-icon">📊</div>
            <div className="chart-text">Spending Trend</div>
            <div style={{ fontSize: "0.8rem", color: "#a8adc4" }}>
              Coming soon
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-bar">
        <button 
          className="action-btn"
          onClick={() => navigate(isVendor ? "/rfqs" : "/rfq/create")}
        >
          {isVendor ? "View RFQs" : "+ New RFQ"}
        </button>
        <button className="action-btn">Add Vendor</button>
        <button className="action-btn">View Invoices</button>
      </div>
    </div>
  );
}
