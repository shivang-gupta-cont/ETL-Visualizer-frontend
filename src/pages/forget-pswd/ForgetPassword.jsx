import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../../components/styles/Login.css"

const EmailIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 7l10 7 10-7" />
    </svg>
)


export default function ForgetPassword() {
    const [email, setEmail] = useState('')
    const [error, seterror] = useState('')
    const [focused, setFocused] = useState(null)
    const [loading, setLoading] = useState(false)
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
        seterror('')

        const emailError = validateEmail(email)
        if (emailError) {
            seterror(emailError)
            return
        }

        // TODO: COMPLETE THIS FORGET PASSWORD SERVICE 
        setLoading(true)
        try {

        } catch (err) {

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
                        <p className="login-subtitle">Forget Password</p>
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
                                    value={email}
                                    onChange={handleChange}
                                    onFocus={() => setFocused('email')}
                                    onBlur={() => setFocused(null)}
                                    required
                                    placeholder="Enter your email"
                                    className="login-input"
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button type="submit" disabled={loading} className="login-btn">
                            {loading ? (
                                <span className="btn-spinner-wrap">
                                    <span className="btn-spinner" />
                                    Verifying Mail...
                                </span>
                            ) : "Next →"}
                        </button>

                        {/* Footer */}
                        <button type="button" className="back-btn" onClick={() => navigate("/login")}>
                            ← back
                        </button>

                    </form>
                </div>
            </div>
        </div>
    )
}