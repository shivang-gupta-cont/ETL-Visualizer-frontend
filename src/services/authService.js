import API from './api'

export const login = (credentials) => API.post('/auth/login', credentials)

export const registerReq = (userData) => API.post('/auth/register', userData)

// Logout — optional: call backend to invalidate token
// export const logout = () => API.post('/auth/logout')

