import { Link } from "react-router"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useForm } from "../hook/useForm"
import useAuth from "../hook/useAuth"
import PasswordField from "../components/PasswordField"
import "../styles/auth.scss"

// ── SVG Icons ────────────────────────────────────────────────────────────────
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


// ──────────────────────────────────────────────────────────────────────────────

const Login = () => {
  const { formValues, handleChange } = useForm({ email: "", password: "" })
  const { LoginUser } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    LoginUser(formValues)
  }

  return (
    <main className="auth-page">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="auth-card">
        {/* Avatar */}
        <div className="auth-avatar">
          <UserIcon />
        </div>

        {/* Header */}
        <h1 className="auth-heading">Welcome back</h1>
        <p className="auth-subheading">Please sign in to continue</p>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>

          {/* Email */}
          <div className="auth-field">
            <label htmlFor="login-email">Email address</label>
            <div className="input-wrapper">
              <MailIcon />
              <input
                id="login-email"
                required
                type="email"
                name="email"
                placeholder="you@example.com"
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor="login-password">Password</label>
            <PasswordField onChange={handleChange} placeholder="••••••••" />
          </div>

          {/* Submit */}
          <button type="submit" className="auth-btn">
            Sign In
          </button>

        </form>

        {/* Redirect */}
        <p className="auth-redirect">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </main>
  )
}

export default Login