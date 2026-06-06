import { useState } from "react";
import "../styles/activity.scss";

export default function Activity() {
  const [activeTab, setActiveTab] = useState("all");

  const activityLogs = [
    {
      id: 1,
      type: "quotation",
      title: "Quotation selected",
      description: "Infra supplies pvt ltd selected for office furniture q2",
      timestamp: "23 may 2025, 4:15 PM",
      icon: "✓",
      category: "quotations",
    },
    {
      id: 2,
      type: "approval",
      title: "Approval pending",
      description: "PO-2026 awaiting L2 approval by priya shah",
      timestamp: "22 may 2025, 04:15 AM",
      icon: "⏳",
      category: "approvals",
    },
    {
      id: 3,
      type: "rfq",
      title: "RFQ published",
      description: "Office furniture Q2 sent to 3 vendors",
      timestamp: "19 may 2025",
      icon: "📋",
      category: "rfq",
    },
    {
      id: 4,
      type: "vendor",
      title: "Vendor added",
      description: "FastEng transport registered and pending verifications",
      timestamp: "18 may 2025, 3:20 PM",
      icon: "👤",
      category: "vendors",
    },
    {
      id: 5,
      type: "invoice",
      title: "Invoice created",
      description: "INV-2025-001 generated for PO-2026 from Infra Supplies",
      timestamp: "17 may 2025, 2:45 PM",
      icon: "📄",
      category: "invoices",
    },
    {
      id: 6,
      type: "rfq",
      title: "RFQ draft created",
      description: "New RFQ draft for IT Equipment created",
      timestamp: "15 may 2025, 10:30 AM",
      icon: "📋",
      category: "rfq",
    },
    {
      id: 7,
      type: "approval",
      title: "Approval completed",
      description: "PO-2025 approved by Rahul Mehta",
      timestamp: "14 may 2025, 9:15 AM",
      icon: "✓",
      category: "approvals",
    },
    {
      id: 8,
      type: "vendor",
      title: "Vendor status updated",
      description: "Tech Core LTD status changed from Pending to Active",
      timestamp: "10 may 2025, 5:30 PM",
      icon: "👤",
      category: "vendors",
    },
  ];

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

  return (
    <div className="activity-container">
      {/* Page Header */}
      <div className="activity-header">
        <div className="header-content">
          <h1 className="activity-title">Activity & Logs</h1>
          <p className="activity-subtitle">Procurement audit trail</p>
        </div>
      </div>

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

      {/* Activity Logs */}
      <div className="activity-logs">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log) => (
            <div key={log.id} className={`activity-item type-${log.type}`}>
              <div className="activity-icon">{log.icon}</div>
              <div className="activity-content">
                <h3 className="activity-log-title">{log.title}</h3>
                <p className="activity-description">{log.description}</p>
                <p className="activity-timestamp">{log.timestamp}</p>
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
