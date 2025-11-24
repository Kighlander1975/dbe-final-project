// src/components/GuestRoute.jsx
import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

function GuestRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth()
  const { showToast } = useToast()
  const location = useLocation()
  
  // Wir fügen eine Session Storage Variable hinzu, um zu verfolgen,
  // ob der Benutzer gerade erst eingeloggt wurde
  useEffect(() => {
    // Nur Toast zeigen, wenn der Benutzer bereits angemeldet ist
    // UND NICHT gerade erst eingeloggt wurde
    if (isAuthenticated && !loading) {
      const justLoggedIn = sessionStorage.getItem('justLoggedIn') === 'true'
      
      // Wenn der Benutzer nicht gerade erst eingeloggt wurde, zeige den Toast
      if (!justLoggedIn) {
        showToast(
          `Du bist bereits als ${user?.name} angemeldet!`,
          'info',
          8000
        )
      }
      
      // Zurücksetzen des Flags nach der Überprüfung
      sessionStorage.removeItem('justLoggedIn')
    }
  }, [isAuthenticated, loading, user, showToast])

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