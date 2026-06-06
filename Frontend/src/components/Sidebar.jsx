import { useState } from "react";
import { useLocation, Link } from "react-router";
import useAuth from "../features/auth/hook/useAuth";
import "../styles/sidebar.scss";

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  const menuItems = [
    { label: "Dashboard", path: "/", icon: "📊" },
    ...(user?.role === "ADMIN" ? [{ label: "User Approvals", path: "/admin/approvals", icon: "👥" }] : []),
    { label: "Vendors", path: "/vendors", icon: "🏢" },
    { label: "RFQ's", path: "/rfqs", icon: "📋" },
    { label: "Quotations", path: "/quotations", icon: "💬" },
    { label: "Approvals", path: "/approvals", icon: "✓" },
    { label: "Purchase Orders", path: "/purchase-orders", icon: "📦" },
    { label: "Invoices", path: "/invoices", icon: "💳" },
    { label: "Reports", path: "/reports", icon: "📈" },
    { label: "Activity", path: "/activity", icon: "🕐" },
  ];

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button
        className="sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? "Expand" : "Collapse"}
      >
        {collapsed ? "→" : "←"}
      </button>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
            title={item.label}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
