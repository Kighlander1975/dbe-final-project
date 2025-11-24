// src/components/AdminRoute.jsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth()
  const { showToast } = useToast()

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        fontSize: '1.5rem',
      }}>
        ⏳ Laden...
      </div>
    )
  }

  // Nicht eingeloggt
  if (!user) {
    showToast('Bitte melde dich an, um fortzufahren.', 'warning', 5000)
    return <Navigate to="/login" replace />
  }

  // Kein Admin
  if (!isAdmin()) {
    showToast('⛔ Du hast keine Berechtigung für diesen Bereich!', 'error', 5000)
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute
