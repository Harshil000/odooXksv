import { useState, useEffect } from "react";
import useAuth from "../features/auth/hook/useAuth";
import { useNavigate } from "react-router";
import axios from "axios";
import "../styles/dashboard.scss";

const dashboardApi = axios.create({
  baseURL: "http://localhost:3000/api/dashboard",
  withCredentials: true,
});

const formatAmount = (amount) => {
  if (amount >= 100000) {
    return `$ ${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    return `$ ${(amount / 1000).toFixed(1)}K`;
  }
  return `$ ${amount.toLocaleString()}`;
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    activeRfqsCount: 0,
    pendingApprovalsCount: 0,
    poSumThisMonth: 0,
    overdueInvoicesCount: 0,
  });
  const [recentPos, setRecentPos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await dashboardApi.get("/");
        if (active) {
          setStats({
            activeRfqsCount: response.data.activeRfqsCount,
            pendingApprovalsCount: response.data.pendingApprovalsCount,
            poSumThisMonth: response.data.poSumThisMonth,
            overdueInvoicesCount: response.data.overdueInvoicesCount,
          });
          setRecentPos(response.data.recentPurchaseOrders || []);
          setError(null);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        if (active) {
          setError("Failed to load dashboard metrics");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    if (user) {
      fetchDashboard();
    }

    return () => {
      active = false;
    };
  }, [user]);

  if (!user) return null;

  const isVendor = user.role === "VENDOR";
  const isAdmin = user.role === "ADMIN";

  if (loading) {
    return (
      <div className="dashboard-container">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
          <div className="loader" style={{
            width: "40px",
            height: "40px",
            border: "4px solid #c8cad4",
            borderTop: "4px solid #5b6af0",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">
          Welcome back, {user.name} - Today's Overview
        </p>
      </div>

      {error && (
        <div className="alert alert-error" style={{
          background: "#fee2e2",
          color: "#b91c1c",
          padding: "12px 16px",
          borderRadius: "8px",
          marginBottom: "20px",
          fontWeight: 600,
          border: "1px solid #fca5a5"
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card" style={{ cursor: "pointer" }} onClick={() => navigate("/rfqs")}>
          <div className="stat-value">{stats.activeRfqsCount}</div>
          <div className="stat-label">Active RFQ's</div>
        </div>
        <div className="stat-card" style={{ cursor: isVendor ? "default" : "pointer" }} onClick={() => !isVendor && navigate("/approvals")}>
          <div className="stat-value">{stats.pendingApprovalsCount}</div>
          <div className="stat-label">Pending Approvals</div>
        </div>
        <div className="stat-card" style={{ cursor: "pointer" }} onClick={() => navigate("/purchase-orders")}>
          <div className="stat-value">{formatAmount(stats.poSumThisMonth)}</div>
          <div className="stat-label">PO's this month</div>
        </div>
        <div className="stat-card" style={{ cursor: "pointer" }} onClick={() => navigate("/invoices")}>
          <div className="stat-value">{stats.overdueInvoicesCount}</div>
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
                {recentPos.map((po) => (
                  <tr key={po.id}>
                    <td style={{ fontWeight: 600 }}>{po.po_number}</td>
                    <td>{po.company_name}</td>
                    <td style={{ fontWeight: 600 }}>{formatAmount(po.total_amount)}</td>
                    <td className={`status ${
                      po.status === "COMPLETED" ? "approved" : 
                      po.status === "ISSUED" ? "pending" : "draft"
                    }`}>
                      {po.status}
                    </td>
                  </tr>
                ))}
                {recentPos.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", color: "#a8adc4", padding: "20px" }}>
                      No recent purchase orders found.
                    </td>
                  </tr>
                )}
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
      <div className="action-bar" style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "24px" }}>
        <button 
          className="action-btn"
          onClick={() => navigate(isVendor ? "/rfqs" : "/rfq/create")}
          style={{ minWidth: "160px", minHeight: "44px", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
        >
          {isVendor ? "View RFQs" : "+ New RFQ"}
        </button>
        {isAdmin && (
          <button 
            className="action-btn secondary"
            onClick={() => navigate("/admin/approvals")}
            style={{ minWidth: "220px", minHeight: "44px", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
          >
            Manage User Approvals
          </button>
        )}
        <button 
          className="action-btn secondary" 
          onClick={() => navigate("/vendors")}
          style={{ minWidth: "160px", minHeight: "44px", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
        >
          View Vendors
        </button>
        <button 
          className="action-btn secondary" 
          onClick={() => navigate("/invoices")}
          style={{ minWidth: "160px", minHeight: "44px", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
        >
          View Invoices
        </button>
      </div>
    </div>
  );
}
