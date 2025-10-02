import { Routes, Route, Navigate } from 'react-router-dom'  
import LoginPage from '../pages/login/LoginPage'
import { ProtectedRoute } from './ProtectedRoutes'
import HomePage from '../pages/home/HomePage'
import ComandaItensPage from '../pages/comanda/ComandaItensPage'
import ComandaDetalhesPage from '../pages/comanda/ComandaDetalhesPage'



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

       <Route
        path="/comanda/:id/itens"
        element={
          <ProtectedRoute>
            <ComandaItensPage />
          </ProtectedRoute>
        }
      />

       <Route
        path="/comanda/:id/detalhes"
        element={
          <ProtectedRoute>
            <ComandaDetalhesPage />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}
