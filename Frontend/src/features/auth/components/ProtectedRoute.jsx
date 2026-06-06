import { Navigate, Outlet } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../auth.context";

export function ProtectedRoute({ allowedRoles }) {
  const { user, checkingAuth } = useContext(AuthContext);

  if (checkingAuth) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#16171d",
        color: "#f3f4f6",
        fontFamily: "system-ui, sans-serif"
      }}>
        <div style={{
          width: "50px",
          height: "50px",
          border: "5px solid #2e303a",
          borderTop: "5px solid #c084fc",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <p style={{ marginTop: "20px", fontSize: "16px", color: "#9ca3af" }}>Verifying session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#16171d",
        color: "#f3f4f6",
        fontFamily: "system-ui, sans-serif"
      }}>
        <h1 style={{ color: "#ef4444" }}>403 - Forbidden</h1>
        <p style={{ color: "#9ca3af" }}>You do not have permission to access this page.</p>
        <Navigate to="/" replace />
      </div>
    );
  }

  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { user, checkingAuth } = useContext(AuthContext);

  if (checkingAuth) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#16171d",
        color: "#f3f4f6",
        fontFamily: "system-ui, sans-serif"
      }}>
        <div style={{
          width: "50px",
          height: "50px",
          border: "5px solid #2e303a",
          borderTop: "5px solid #c084fc",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <p style={{ marginTop: "20px", fontSize: "16px", color: "#9ca3af" }}>Loading...</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
