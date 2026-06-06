import useAuth from "../features/auth/hook/useAuth";
import "../styles/navbar.scss";

const Navbar = () => {
  const { user, LogoutUser } = useAuth();

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <div className="navbar-logo">
            <span className="logo-text">VendorBridge</span>
          </div>
        </div>

        <div className="navbar-right">
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-role">{user.role}</span>
          </div>
          <div className="user-avatar">
            {user.name ? user.name[0].toUpperCase() : "U"}
          </div>
          <button className="logout-btn" onClick={LogoutUser} title="Logout">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
