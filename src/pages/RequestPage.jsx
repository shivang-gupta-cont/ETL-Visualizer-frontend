import { useEffect, useState } from "react"
import Navbar from "../components/common/Navbar"
import { approveRequest, getAllRequests, getAllUsers, rejectAllRequests, rejectRequest, removeUser } from "../services/adminService"
import "../components/styles/RequestPage.css"
import { useAuth } from "../context/AuthContext"

// ── Icons ─────────────────────────────────────────────────────────────────────
const CheckIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)

const XIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)

const TrashIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4h6v2" />
    </svg>
)

const SweepIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
    </svg>
)

// ── Buttons ───────────────────────────────────────────────────────────────────
const AcceptButton = ({ onClick }) => <button className="btn-accept" onClick={onClick}><CheckIcon /> Accept</button>
const RejectButton = ({ onClick }) => <button className="btn-reject" onClick={onClick}><XIcon />    Reject</button>
const RemoveButton = ({ onClick }) => <button className="btn-remove" onClick={onClick}><TrashIcon /> Remove</button>
const RejectAllButton = ({ onClick, disabled }) => (
    <button className="btn-clear-all" onClick={onClick} disabled={disabled}>
        <SweepIcon /> Reject All
    </button>
)

// ── Main Component ────────────────────────────────────────────────────────────
export default function RequestPage() {
    const [users, setUsers] = useState([])
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()

    // ── Requests handlers ─────────────────────────────────────────────────────
    const handleAccept = async (username, role) => {
        try {
            await approveRequest(username)
            setRequests(prev => prev.filter(r => r.username !== username))
            setUsers(prev => [...prev, { username, role }])
        } catch { console.log("error accepting request") }
    }

    const handleReject = async (username) => {
        try {
            await rejectRequest(username)
            setRequests(prev => prev.filter(r => r.username !== username))
        } catch { console.log("error rejecting request") }
    }

    // ── Users handlers ────────────────────────────────────────────────────────
    // TODO: replace with your actual API call e.g. await deleteUser(username)
    const handleRemoveUser = async (username) => {
        try {
            await removeUser(username)
            setUsers(prev => prev.filter(u => u.username !== username))
        } catch { console.log("error removing user") }
    }

    // TODO: replace with your actual API call e.g. await clearAllRequests()
    const handleRejectAllRequests = async () => {
        try {
            await rejectAllRequests()
            setRequests([])
        } catch { console.log("error clearing all requests") }
    }

    // ── Fetch ─────────────────────────────────────────────────────────────────
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, requestsRes] = await Promise.all([
                    getAllUsers(),
                    getAllRequests()
                ])
                setUsers(usersRes.data)
                setRequests(requestsRes.data)
            } catch { console.log("error") }
            finally { setLoading(false) }
        }
        fetchData()
    }, [])

    if (loading) return (
        <div className="admin-loading">
            <span className="admin-loading__text">Loading...</span>
        </div>
    )

    return (
        <div className="request-page">
            <div className="bg-blob bg-blob--top-right" />
            <div className="bg-blob bg-blob--bottom-left" />

            <Navbar />

            <div className="admin-content">

                <h1 className="admin-title">
                    ⚡ <span className="admin-title__gradient">Admin Panel</span>
                </h1>

                {/* ── Registered Users ──────────────────────────────────── */}
                <section className="users-section">
                    <div className="section-header">
                        <div className="section-accent section-accent--blue" />
                        <h2 className="section-title section-title--blue">Registered Users</h2>
                        <span className="section-count section-count--blue">{users.length - 1} total</span>
                    </div>

                    <div className="table-scroll-wrapper">
                        <div className="table-card">
                            <table className="data-table">
                                <thead>
                                    <tr className="thead--blue">
                                        <th className="th--blue">#</th>
                                        <th className="th--blue">Username</th>
                                        <th className="th--blue">Role</th>
                                        <th className="th--blue">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="cell-empty">No users found.</td>
                                        </tr>
                                    ) : users
                                        .filter(user_ => user?.username !== user_.username)
                                        .map((user_, i) => (
                                            <tr key={user_.username}>
                                                <td className="cell-serial">{i + 1}</td>
                                                <td className="cell-username">{user_.username}</td>
                                                <td>
                                                    <span className={`role-badge ${user_.role === "ADMIN" ? "role-badge--admin" : "role-badge--user"}`}>
                                                        {user_.role}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="cell-actions">
                                                        <RemoveButton onClick={() => handleRemoveUser(user_.username)} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* ── Pending Requests ──────────────────────────────────── */}
                <section className="requests-section">
                    <div className="section-header">
                        <div className="section-accent section-accent--red" />
                        <h2 className="section-title section-title--red">Pending Requests</h2>
                        <span className="section-count section-count--red">{requests.length} pending</span>
                        <RejectAllButton
                            onClick={handleRejectAllRequests}
                            disabled={requests.length === 0}
                        />
                    </div>

                    <div className="table-scroll-wrapper">
                        <div className="table-card">
                            <table className="data-table">
                                <thead>
                                    <tr className="thead--red">
                                        <th className="th--red">#</th>
                                        <th className="th--red">Username</th>
                                        <th className="th--red">Role</th>
                                        <th className="th--red">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="cell-empty">No pending requests.</td>
                                        </tr>
                                    ) : requests.map((req, i) => (
                                        <tr key={req.username}>
                                            <td className="cell-serial">{i + 1}</td>
                                            <td className="cell-username">{req.username}</td>
                                            <td>
                                                <span className={`role-badge ${req.role === "ADMIN" ? "role-badge--admin" : "role-badge--user"}`}>
                                                    {req.role}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="cell-actions">
                                                    <AcceptButton onClick={() => handleAccept(req.username, req.role)} />
                                                    <RejectButton onClick={() => handleReject(req.username)} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    )
}