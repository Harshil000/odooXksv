import { Link } from "react-router"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useForm } from "../hook/useForm"
import useAuth from "../hook/useAuth"
import PasswordField from "../components/PasswordField"
import "../styles/auth.scss"

// ── Icons ────────────────────────────────────────────────────────────────────
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    className="input-icon">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)

const NameIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    className="input-icon">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    className="input-icon">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
)

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    className="input-icon">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.56 6.56l.93-.93a2 2 0 0 1 2.1-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)

const HashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    className="input-icon">
    <line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/>
    <line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>
  </svg>
)
// ──────────────────────────────────────────────────────────────────────────────

const ROLES = [
  { value: "VENDOR",               label: "Vendor",        icon: "🏢" },
  { value: "PROCUREMENT_OFFICER",  label: "Procurement",   icon: "📋" },
  { value: "MANAGER",              label: "Manager",       icon: "👔" },
]

const Register = () => {
  const { formValues, handleChange } = useForm({
    email: "", name: "", password: "", role: "VENDOR",
    company_name: "", gst_number: "", contact_person: "", phone: "", address: ""
  })

  const { RegisterUser } = useAuth()
  const isVendor = formValues.role === "VENDOR"

  const handleSubmit = (e) => {
    e.preventDefault()
    RegisterUser(formValues)
  }

  return (
    <main className="auth-page">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="auth-card auth-card--register">

        {/* ── Left branding panel ── */}
        <div className="register-left">
          <div className="auth-avatar">
            <UserIcon />
          </div>
          <h1 className="auth-heading">Create Account</h1>
          <p className="auth-subheading">Join KSV procurement portal</p>

          <p className="auth-redirect" style={{ marginTop: "auto", paddingTop: 24 }}>
            Already have an account?<br />
            <Link to="/login">Sign in</Link>
          </p>
        </div>

        {/* ── Vertical divider ── */}
        <div className="register-divider" />

        {/* ── Right form panel ── */}
        <div className="register-right">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form-scroll">

              {/* Full Name */}
              <div className="auth-field">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <NameIcon />
                  <input
                    required
                    type="text"
                    name="name"
                    placeholder="John Appleseed"
                    onChange={handleChange}
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="auth-field">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <MailIcon />
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Role */}
              <div className="auth-field">
                <label>Select Your Role</label>
                <div className="role-selector">
                  {ROLES.map(r => (
                    <div className="role-option" key={r.value}>
                      <input
                        type="radio"
                        id={`role-${r.value}`}
                        name="role"
                        value={r.value}
                        checked={formValues.role === r.value}
                        onChange={handleChange}
                      />
                      <label htmlFor={`role-${r.value}`}>
                        <span className="role-icon">{r.icon}</span>
                        <span className="role-name">{r.label}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vendor-specific fields */}
              {isVendor && (
                <div className="vendor-section">
                  <p className="vendor-section-title">🏪 Vendor Details</p>

                  <div className="auth-field">
                    <label>Company Name *</label>
                    <div className="input-wrapper">
                      <BuildingIcon />
                      <input
                        required
                        type="text"
                        name="company_name"
                        placeholder="Acme Corp"
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="auth-field">
                    <label>GST Number</label>
                    <div className="input-wrapper">
                      <HashIcon />
                      <input
                        type="text"
                        name="gst_number"
                        placeholder="22AAAAA0000A1Z5"
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="auth-field">
                    <label>Phone Number</label>
                    <div className="input-wrapper">
                      <PhoneIcon />
                      <input
                        type="text"
                        name="phone"
                        placeholder="+91 98765 43210"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="auth-field">
                <label>Password</label>
                <PasswordField onChange={handleChange} placeholder="Minimum 6 characters" />
              </div>

            </div>{/* end auth-form-scroll */}

            {/* Submit */}
            <button type="submit" className="auth-btn" style={{ marginTop: 14, flexShrink: 0 }}>
              Create Account
            </button>
          </form>
        </div>

      </div>
    </main>
  )
}

export default Register