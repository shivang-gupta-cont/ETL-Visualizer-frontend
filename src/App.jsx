import './App.css'
import Login from './pages/auth/Login'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/routeprotection/ProtectedRoute'
import Register from './pages/auth/Register'
import RequestPage from './pages/RequestPage'
import AdminRoute from './components/routeprotection/AdminRoute'
import PublicRoute from './components/routeprotection/PublicRoute'
import ForgetPassword from './pages/forget-pswd/ForgetPassword'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />}></Route>

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login></Login>
              </PublicRoute>
            }>
          </Route>

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register></Register>
              </PublicRoute>
            }>
          </Route>

          <Route
            path="/forget-password"
            element={
              <PublicRoute>
                <ForgetPassword />
              </PublicRoute>
            }>
          </Route>

          <Route path="/admin/requests" element={
            <AdminRoute>
              <RequestPage></RequestPage>
            </AdminRoute>
          }
          ></Route>

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          ></Route>

          <Route path="*" element={<Navigate to="/login" />}></Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider >
  )
}

export default App
