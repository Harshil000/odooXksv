import { useState, useEffect } from "react";
import useActivity from "../hook/useActivity";
import "../../../styles/activity.scss";

export default function Activity() {
  const [activeTab, setActiveTab] = useState("all");
  const { activityLogs, loading, error, loadActivities } = useActivity();

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const tabs = [
    { label: "All", value: "all" },
    { label: "RFQ", value: "rfq" },
    { label: "Approvals", value: "approvals" },
    { label: "Invoices", value: "invoices" },
    { label: "Vendors", value: "vendors" },
  ];

  const filteredLogs =
    activeTab === "all"
      ? activityLogs
      : activityLogs.filter((log) => log.category === activeTab);

  const getIcon = (type) => {
    switch (type) {
      case "rfq":
        return "📋";
      case "quotation":
        return "💬";
      case "approval":
        return "✓";
      case "vendor":
        return "👤";
      case "invoice":
        return "📄";
      case "po":
        return "📦";
      default:
        return "🕐";
    }
  };

  const getFormattedTime = (ts) => {
    try {
      const date = new Date(ts);
      return date.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
    } catch {
      return ts;
    }
  };

  if (loading && activityLogs.length === 0) {
    return (
      <div className="activity-container">
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
    <div className="activity-container">
      {/* Page Header */}
      <div className="activity-header">
        <div className="header-content">
          <h1 className="activity-title">Activity & Logs</h1>
          <p className="activity-subtitle">Procurement audit trail (Live Database Logs)</p>
        </div>
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

      {/* Filter Tabs */}
      <div className="activity-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`tab-button ${activeTab === tab.value ? "active" : ""}`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Activity Logs List */}
      <div className="activity-logs">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log, idx) => (
            <div key={idx} className={`activity-item type-${log.type}`}>
              <div className="activity-icon">{getIcon(log.type)}</div>
              <div className="activity-content">
                <h3 className="activity-log-title">{log.title}</h3>
                <p className="activity-description">{log.description}</p>
                <p className="activity-timestamp">{getFormattedTime(log.timestamp)}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-activity">
            <p>No activity logs found</p>
          </div>
        )}
      </div>
    </div>
  );
}
