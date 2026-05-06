import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "../styles/Navbar.css"

// SVG Icons
const LogoutIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
)

const AdminIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
)

export default function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    // Get initials for avatar
    const initials = user?.username?.slice(0, 2).toUpperCase() || "?"

    return (
        <nav className="navbar">
            {/* Logo */}
            <Link to="/dashboard" className="navbar-logo">
                <div className="navbar-logo-icon">⚡</div>
                <span className="navbar-logo-text">ETL Dashboard</span>
            </Link>

            {/* Right side */}
            {user && (
                <div className="navbar-right">

                    {/* Admin link */}
                    {user.role === "ADMIN" && (
                        <Link to="/admin/requests" className="navbar-admin-link">
                            <AdminIcon />
                            Manage Requests
                        </Link>
                    )}

                    <div className="navbar-divider" />

                    {/* User badge */}
                    <div className="navbar-user-badge">
                        <div className="navbar-user-avatar">{initials}</div>
                        <span className="navbar-username">{user.username}</span>
                        <span className={`navbar-role-tag ${user.role === "ADMIN" ? "admin" : "user"}`}>
                            {user.role}
                        </span>
                    </div>

                    {/* Logout */}
                    <button className="navbar-logout-btn" onClick={handleLogout}>
                        <LogoutIcon />
                        Logout
                    </button>

                </div>
            )}
        </nav>
    )
}