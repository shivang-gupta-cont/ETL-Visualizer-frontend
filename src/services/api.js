import axios from 'axios'

// Base axios instance pointing to your Spring Boot backend
const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // change this to your Spring Boot URL
    headers: {
        'Content-Type': 'application/json',
    },
})

// Automatically attach JWT token to every request if it exists
API.interceptors.request.use((config) => {
    console.log("sending a new request...")
    const user = JSON.parse(localStorage.getItem('user'))
    console.log(user)
    if (user?.jwtString) {
        config.headers.Authorization = `Bearer ${user.jwtString}`
        console.log('Authorization header:', config.headers.Authorization)
    }
    return config
})

// Handle global errors (e.g., 401 Unauthorized → redirect to login)
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (!window.location.pathname.includes('/login')) {
                localStorage.removeItem('user')
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export default API