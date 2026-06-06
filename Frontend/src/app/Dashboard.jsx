import useAuth from "../features/auth/hook/useAuth";

export default function Dashboard() {
  const { user, LogoutUser } = useAuth();

  if (!user) return null;

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0f172a",
      backgroundImage: "radial-gradient(circle at top left, #1e1b4b, transparent 40%), radial-gradient(circle at bottom right, #020617, transparent), radial-gradient(circle at center, #111827, #090d16)",
      color: "#f8fafc",
      fontFamily: "system-ui, -apple-system, sans-serif",
      padding: "40px 20px",
      boxSizing: "border-box"
    }}>
      <div style={{
        maxWidth: "900px",
        margin: "0 auto",
      }}>
        {/* Header */}
        <header style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          paddingBottom: "20px"
        }}>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: "36px",
              fontWeight: 800,
              background: "linear-gradient(135deg, #a78bfa, #c084fc, #6366f1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.05em"
            }}>
              KSV Dashboard
            </h1>
            <p style={{ margin: "5px 0 0", color: "#94a3b8", fontSize: "14px" }}>
              Welcome back to your procurement portal
            </p>
          </div>
          <button
            onClick={LogoutUser}
            style={{
              padding: "10px 20px",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              color: "#fca5a5",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.25)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
              e.currentTarget.style.transform = "none";
            }}
          >
            Logout
          </button>
        </header>

        {/* User Card */}
        <div style={{
          background: "rgba(30, 41, 59, 0.4)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "16px",
          padding: "30px",
          marginBottom: "30px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "25px" }}>
            <div style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              backgroundColor: "#c084fc",
              color: "#0f172a",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "24px",
              fontWeight: "700"
            }}>
              {user.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "700" }}>{user.name}</h2>
              <span style={{
                display: "inline-block",
                padding: "3px 10px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "600",
                backgroundColor: "rgba(192, 132, 252, 0.15)",
                color: "#e879f9",
                border: "1px solid rgba(192, 132, 252, 0.3)",
                marginTop: "6px"
              }}>
                {user.role}
              </span>
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            paddingTop: "20px"
          }}>
            <div>
              <span style={{ display: "block", color: "#64748b", fontSize: "12px", textTransform: "uppercase", fontWeight: "600" }}>Email Address</span>
              <span style={{ fontSize: "16px", color: "#cbd5e1" }}>{user.email}</span>
            </div>
            <div>
              <span style={{ display: "block", color: "#64748b", fontSize: "12px", textTransform: "uppercase", fontWeight: "600" }}>Account Status</span>
              <span style={{ fontSize: "16px", color: user.is_active ? "#4ade80" : "#ef4444", fontWeight: "600" }}>
                {user.is_active ? "● Active" : "● Inactive"}
              </span>
            </div>
            <div>
              <span style={{ display: "block", color: "#64748b", fontSize: "12px", textTransform: "uppercase", fontWeight: "600" }}>Account ID</span>
              <span style={{ fontSize: "16px", color: "#cbd5e1", fontFamily: "monospace" }}>#{user.id}</span>
            </div>
          </div>
        </div>

        {/* Vendor Details Section if VENDOR */}
        {user.role === "VENDOR" && (
          <div style={{
            background: "rgba(30, 41, 59, 0.4)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "30px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
          }}>
            <h3 style={{
              margin: "0 0 20px 0",
              fontSize: "18px",
              fontWeight: "700",
              color: "#c084fc",
              borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
              paddingBottom: "10px"
            }}>
              Vendor Profile Details
            </h3>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px"
            }}>
              <div>
                <span style={{ display: "block", color: "#64748b", fontSize: "12px", textTransform: "uppercase", fontWeight: "600" }}>Company Name</span>
                <span style={{ fontSize: "16px", color: "#cbd5e1", fontWeight: "600" }}>{user.company_name || "N/A"}</span>
              </div>
              <div>
                <span style={{ display: "block", color: "#64748b", fontSize: "12px", textTransform: "uppercase", fontWeight: "600" }}>GST Number</span>
                <span style={{ fontSize: "16px", color: "#cbd5e1", fontFamily: "monospace" }}>{user.gst_number || "Not Provided"}</span>
              </div>
              <div>
                <span style={{ display: "block", color: "#64748b", fontSize: "12px", textTransform: "uppercase", fontWeight: "600" }}>Contact Person</span>
                <span style={{ fontSize: "16px", color: "#cbd5e1" }}>{user.contact_person || "N/A"}</span>
              </div>
              <div>
                <span style={{ display: "block", color: "#64748b", fontSize: "12px", textTransform: "uppercase", fontWeight: "600" }}>Phone Contact</span>
                <span style={{ fontSize: "16px", color: "#cbd5e1" }}>{user.phone || "Not Provided"}</span>
              </div>
              <div>
                <span style={{ display: "block", color: "#64748b", fontSize: "12px", textTransform: "uppercase", fontWeight: "600" }}>Business Address</span>
                <span style={{ fontSize: "16px", color: "#cbd5e1", whiteSpace: "pre-wrap" }}>{user.address || "Not Provided"}</span>
              </div>
              <div>
                <span style={{ display: "block", color: "#64748b", fontSize: "12px", textTransform: "uppercase", fontWeight: "600" }}>Vendor Rating</span>
                <span style={{ fontSize: "16px", color: "#f59e0b", fontWeight: "600" }}>
                  ⭐ {Number(user.rating || 0).toFixed(1)} / 5.0
                </span>
              </div>
              <div>
                <span style={{ display: "block", color: "#64748b", fontSize: "12px", textTransform: "uppercase", fontWeight: "600" }}>Vendor Status</span>
                <span style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontSize: "13px",
                  fontWeight: "600",
                  backgroundColor: user.vendor_status === "ACTIVE" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                  color: user.vendor_status === "ACTIVE" ? "#34d399" : "#f87171",
                  marginTop: "4px"
                }}>
                  {user.vendor_status || "ACTIVE"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
