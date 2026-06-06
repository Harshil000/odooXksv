import { useEffect } from "react";
import useAuth from "../../auth/hook/useAuth";
import useUserApproval from "../hook/useUserApproval";
import "../../../styles/dashboard.scss";

export default function UserApprovals() {
  const { user: currentUser } = useAuth();
  const {
    users,
    loading,
    error,
    message,
    loadUsersList,
    toggleUserStatus,
  } = useUserApproval();

  useEffect(() => {
    loadUsersList();
  }, [loadUsersList]);

  if (loading && users.length === 0) {
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
      <div className="dashboard-header">
        <h1 className="dashboard-title">User Approvals</h1>
        <p className="dashboard-subtitle">
          Manage system users and approve registrations (Admin Panel)
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

      {message && (
        <div className="alert alert-success" style={{
          background: "#ecfdf5",
          color: "#047857",
          padding: "12px 16px",
          borderRadius: "8px",
          marginBottom: "20px",
          fontWeight: 600,
          border: "1px solid #6ee7b7"
        }}>
          ✓ {message}
        </div>
      )}

      <div className="table-card">
        <div className="card-title">All Registered Users</div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>User Details</th>
                <th>Role</th>
                <th>Company / Vendor Info</th>
                <th>Vendor Status</th>
                <th>Account Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSelf = Number(currentUser?.id) === Number(u.id);
                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: "#3a3d52" }}>{u.full_name}</div>
                      <div style={{ fontSize: "0.75rem", color: "#7a7f9a" }}>{u.email}</div>
                    </td>
                    <td>
                      <span className="status-badge" style={{
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        background: u.role === "ADMIN" ? "#fee2e2" : u.role === "VENDOR" ? "#e0e7ff" : "#fef3c7",
                        color: u.role === "ADMIN" ? "#991b1b" : u.role === "VENDOR" ? "#3730a3" : "#92400e",
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      {u.role === "VENDOR" ? (
                        <div>
                          <div style={{ fontWeight: 500 }}>{u.company_name}</div>
                          {u.gst_number && <div style={{ fontSize: "0.7rem", color: "#a8adc4" }}>GST: {u.gst_number}</div>}
                        </div>
                      ) : (
                        <span style={{ color: "#a8adc4" }}>—</span>
                      )}
                    </td>
                    <td>
                      {u.role === "VENDOR" ? (
                        <span className={`status ${u.vendor_status === "ACTIVE" ? "approved" : "draft"}`}>
                          {u.vendor_status}
                        </span>
                      ) : (
                        <span style={{ color: "#a8adc4" }}>—</span>
                      )}
                    </td>
                    <td>
                      <span className={`status ${u.is_active ? "approved" : "draft"}`}>
                        {u.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={u.is_active}
                          onChange={() => toggleUserStatus(u.id, u.is_active)}
                          disabled={isSelf}
                        />
                        <span className="slider round"></span>
                      </label>
                      {isSelf && (
                        <span style={{ fontSize: "0.7rem", color: "#a8adc4", marginLeft: "8px", verticalAlign: "middle" }}>
                          (You)
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", color: "#a8adc4", padding: "20px" }}>
                    No users registered in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
