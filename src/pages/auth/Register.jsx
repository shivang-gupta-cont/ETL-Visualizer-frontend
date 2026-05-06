// import { useState } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import { registerReq as registerReqService } from "../../services/authService"

// export default function Register() {
//     const [form, setForm] = useState({ username: '', password: '', role: '' })
//     const [error, setError] = useState('')
//     const [loading, setLoading] = useState(false)

//     const navigate = useNavigate()

//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value })
//     }

//     const handleSubmit = async (e) => {
//         e.preventDefault()
//         setError('')
//         setLoading(true)

//         try {
//             await registerReqService(form)
//             navigate('/register')
//         } catch (err) {
//             setError(err.response?.data?.message || 'Signup failed. Please try again.')
//         } finally {
//             setLoading(false)
//         }
//     }



//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-100">
//             <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
//                 <h1 className="text-2xl font-bold text-indigo-600 mb-2 text-center">
//                     Request To Register
//                 </h1>
//                 <p className="text-center text-gray-500 mb-6 text-sm">
//                     Request to access ETL Dashboard
//                 </p>

//                 {error && (
//                     <div className="bg-red-100 text-red-600 text-sm px-4 py-2 rounded-md mb-4">
//                         {error}
//                     </div>
//                 )}

//                 <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Username
//                         </label>
//                         <input
//                             type="text"
//                             name="username"
//                             value={form.username}
//                             onChange={handleChange}
//                             required
//                             placeholder="Enter Username..."
//                             className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Password
//                         </label>
//                         <input
//                             type="password"
//                             name="password"
//                             value={form.password}
//                             onChange={handleChange}
//                             required
//                             placeholder="••••••••"
//                             className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Role
//                         </label>

//                         <div className="space-y-2">
//                             <label className="flex items-center space-x-2">
//                                 <input
//                                     type="radio"
//                                     name="role"
//                                     value="ADMIN"
//                                     checked={form.role === "ADMIN"}
//                                     onChange={handleChange}
//                                     required
//                                     className="text-indigo-600 focus:ring-indigo-400"
//                                 />
//                                 <span className="text-sm text-gray-700">Admin</span>
//                             </label>

//                             <label className="flex items-center space-x-2">
//                                 <input
//                                     type="radio"
//                                     name="role"
//                                     value="USER"
//                                     checked={form.role === "USER"}
//                                     onChange={handleChange}
//                                     className="text-indigo-600 focus:ring-indigo-400"
//                                 />
//                                 <span className="text-sm text-gray-700">User</span>
//                             </label>
//                         </div>
//                     </div>

//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
//                     >
//                         {loading ? 'Requesting for account...' : 'Send Request'}
//                     </button>
//                 </form>

//                 <p className="text-center text-sm text-gray-500 mt-6">
//                     Already have an account?{' '}
//                     <Link to="/login" className="text-indigo-600 font-medium hover:underline">
//                         Sign in
//                     </Link>
//                 </p>
//             </div>
//         </div>
//     )
// }


import { useState } from "react"
import { Link } from "react-router-dom"
import { registerReq as registerReqService } from "../../services/authService"
import "../../components/styles/Register.css"

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const PersonIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
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

const ShieldIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
)

const UserIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
)

// ── Main Component ────────────────────────────────────────────────────────────
export default function Register() {
    const [form, setForm] = useState({ username: '', email: '', password: '', role: '' })
    const [message, setMessage] = useState({ msg: '', status: '' })
    const [loading, setLoading] = useState(false)
    const [focused, setFocused] = useState(null)

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const validateEmail = (email) => {
        if (!email) return 'Email is required'
        if (!email.toLowerCase().endsWith('@contevolve.com')) return 'Email must be from @contevolve.com domain'
        return null
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage({ msg: '', status: '' })

        const emailError = validateEmail(form.email)
        if (emailError) {
            setMessage({ msg: emailError, status: "error" })
            return
        }
        if (form.password.length < 6) {
            setMessage({ msg: "Password must be at least 6 characters long.", status: "error" })
            return
        }

        setLoading(true)
        try {
            await registerReqService(form)
            setMessage({ msg: "Registration request sent successfully!", status: "success" })
        } catch (err) {
            setMessage({ msg: err.response?.data?.message || "Request Failed. Try Again.", status: "error" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="register-page">
            {/* Background blobs */}
            <div className="register-blob register-blob-1" />
            <div className="register-blob register-blob-2" />

            {/* Outer glow */}
            <div className="register-outer">
                <div className="register-card">

                    {/* Header */}
                    <div className="register-header">
                        <div className="register-logo">📋</div>
                        <h1 className="register-title">Request to Register</h1>
                        <p className="register-subtitle">Request access to ETL Dashboard</p>
                        <div className="register-divider" />
                    </div>

                    {/* Message */}
                    {message.status === "error" && (
                        <div className="register-error">
                            <span>⚠️</span>
                            <span>{message.msg}</span>
                        </div>
                    )}
                    {message.status === "success" && (
                        <div className="register-success">
                            <span>✅</span>
                            <span>{message.msg}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="register-form">

                        {/* Username */}
                        <div>
                            <label className="register-label">Username</label>
                            <div className="register-input-wrap">
                                <span className={`register-input-icon ${focused === 'username' ? 'focused' : ''}`}>
                                    <PersonIcon />
                                </span>
                                <input
                                    type="text"
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    onFocus={() => setFocused('username')}
                                    onBlur={() => setFocused(null)}
                                    required
                                    placeholder="Enter your username"
                                    className="register-input"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="register-label">Email</label>
                            <div className="register-input-wrap">
                                <span className={`register-input-icon ${focused === 'email' ? 'focused' : ''}`}>
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
                                    className="register-input"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="register-label">Password</label>
                            <div className="register-input-wrap">
                                <span className={`register-input-icon ${focused === 'password' ? 'focused' : ''}`}>
                                    <LockIcon />
                                </span>
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    onFocus={() => setFocused('password')}
                                    onBlur={() => setFocused(null)}
                                    required
                                    placeholder="Enter your password"
                                    className="register-input"
                                />
                            </div>
                        </div>

                        {/* Role */}
                        <div>
                            <label className="register-label">Select Role</label>
                            <div className="role-selector">
                                {[
                                    { value: "ADMIN", label: "Admin", icon: <ShieldIcon /> },
                                    { value: "USER", label: "User", icon: <UserIcon /> },
                                ].map(({ value, label, icon }) => (
                                    <label
                                        key={value}
                                        className={`role-option ${form.role === value ? "selected" : ""}`}
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value={value}
                                            checked={form.role === value}
                                            onChange={handleChange}
                                            required={value === "ADMIN"}
                                        />
                                        {icon}
                                        {label}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Submit */}
                        <button type="submit" disabled={loading} className="register-btn">
                            {loading ? (
                                <span className="register-spinner-wrap">
                                    <span className="register-spinner" />
                                    Sending Request...
                                </span>
                            ) : "Send Request →"}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="register-footer">
                        Already have an account?{' '}
                        <Link to="/login">Sign in</Link>
                    </p>

                </div>
            </div>
        </div>
    )
}