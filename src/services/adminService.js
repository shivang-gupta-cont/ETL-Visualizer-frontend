import API from './api'

// Fetching user data - GET /admin/users
// Expected body: {}
// Expected response: [{username, role}]
export const getAllUsers = () => API.get('/admin/users')

// Fetching user data - GET /admin/registrations
// Expected body: {}
// Expected response: [{username, role}]
export const getAllRequests = () => API.get('/admin/registrations')

// Approve user request - PATCH /admin/registrations/{username}/approve
// Expected body: {}
// Expected response: 204 No content
export const approveRequest = (username) => API.patch(`/admin/registrations/${username}/approve`)

// Approve user request - PATCH /admin/registrations/{username}/reject
// Expected body: {}
// Expected response: 204 No content
export const rejectRequest = (username) => API.delete(`/admin/registrations/${encodeURIComponent(username)}/reject`)


export const removeUser = (username) => API.delete(`/admin/user/${encodeURIComponent(username)}/remove`)

export const rejectAllRequests = () => API.delete(`/admin/registerations/reject-all`)