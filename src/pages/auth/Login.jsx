import { useState } from "react"
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from "../../context/AuthContext"
import { login as loginService } from "../../services/authService"
import "../../components/styles/Login.css"

const EyeIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
)

const EyeOffIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.39 1 12c.74-1.9 2-3.6 3.6-4.9" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c5 0 9.27 3.61 11 8a11.05 11.05 0 0 1-1.39 2.57" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
)

const EmailIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 7l10 7 10-7" />
    </svg>
)

const LockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="11" width="14" height="11" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
)

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [focused, setFocused] = useState(null)
    const [showPass, setShowPass] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const validateEmail = (email) => {
        if (!email) return 'Email is required'
        if (!email.toLowerCase().endsWith('@contevolve.com')) return 'Email must be from @contevolve.com domain'
        return null
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log("prevented?", e.defaultPrevented)
        setError('')

        const emailError = validateEmail(form.email)
        if (emailError) {
            setError(emailError)
            return
        }

        setLoading(true)
        try {
            const res = await loginService(form)
            console.log(res)
            login(res.data)
            navigate('/dashboard')
        } catch (err) {
            if (!err.response) {
                setError("Unable to connect with the server.")
            }
            else setError(err.response?.data?.message || 'Invalid email or password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page">
            {/* Background blobs */}
            <div className="login-blob login-blob-1" />
            <div className="login-blob login-blob-2" />
            <div className="login-blob login-blob-3" />

            {/* Outer glow wrapper */}
            <div className="login-outer">
                <div className="login-card">

                    {/* Header */}
                    <div className="login-header">
                        <div className="login-logo">⚡</div>
                        <h1 className="login-title">ETL Dashboard</h1>
                        <p className="login-subtitle">Sign in to your workspace</p>
                        <div className="login-divider" />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="login-error">
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={(e) => handleSubmit(e)} className="login-form">

                        {/* email */}
                        <div>
                            <label className="login-label">Email</label>
                            <div className="input-wrap">
                                <span className={`input-icon ${focused === 'email' ? 'focused' : ''}`}>
                                    <EmailIcon />
                                </span>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    onFocus={() => setFocused('email')}
                                    onBlur={() => setFocused(null)}
                                    required
                                    placeholder="Enter your email"
                                    className="login-input"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="login-label">Password</label>
                            <div className="input-wrap">
                                <span className={`input-icon ${focused === 'password' ? 'focused' : ''}`}>
                                    <LockIcon />
                                </span>
                                <input
                                    type={showPass ? "text" : "password"}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    onFocus={() => setFocused('password')}
                                    onBlur={() => setFocused(null)}
                                    required
                                    placeholder="Enter your password"
                                    className="login-input has-toggle"
                                />
                                <button
                                    type="button"
                                    className="eye-toggle"
                                    onClick={() => setShowPass(p => !p)}
                                >
                                    {showPass ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>

                        {/* Forget Password */}
                        <div className="forget-password">
                            <Link to="/forget-password">forget password?</Link>
                        </div>

                        {/* Submit */}
                        <button type="submit" disabled={loading} className="login-btn">
                            {loading ? (
                                <span className="btn-spinner-wrap">
                                    <span className="btn-spinner" />
                                    Signing in...
                                </span>
                            ) : "Sign In →"}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="login-footer">
                        Don't have an account?{' '}
                        <Link to="/register">Request to register</Link>
                    </p>

                </div>
            </div>
        </div>
    )
}