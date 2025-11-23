// src/components/GuestRoute.jsx
import React, { useEffect, useRef } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

function GuestRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth()
  const { showToast } = useToast()
  
  // ⭐ Verhindert mehrfaches Auslösen
  const hasShownToast = useRef(false)

  useEffect(() => {
    // Nur einmal Toast zeigen, wenn User eingeloggt ist
    if (isAuthenticated && !loading && !hasShownToast.current) {
      showToast(
        `Du bist bereits als ${user?.name} angemeldet!`,
        'info',
        8000
      )
      hasShownToast.current = true
    }
    
    // Cleanup: Reset beim Unmount
    return () => {
      hasShownToast.current = false
    }
  }, [isAuthenticated, loading]) // ⭐ Nur diese beiden Dependencies

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <p>Lade...</p>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}

export default GuestRoute