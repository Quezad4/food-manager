import { Routes, Route } from 'react-router-dom'  
import LoginPage from '../pages/login/LoginPage'
import { ProtectedRoute } from './ProtectedRoutes'
import HomePage from '../pages/home/HomePage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
