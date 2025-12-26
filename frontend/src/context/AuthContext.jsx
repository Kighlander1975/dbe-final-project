// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react'
import { authAPI } from '../services/api'
import heartbeatService from '../services/heartbeatService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      authAPI.getUser()
        .then(userData => {
          setUser(userData)
          setLoading(false)
        })
        .catch(error => {
          localStorage.removeItem('token')
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  // 🆕 Heartbeat Management
  useEffect(() => {
    if (user) {
      // User ist eingeloggt - Heartbeat starten
      heartbeatService.start()
    } else {
      // User ist ausgeloggt - Heartbeat stoppen
      heartbeatService.stop()
    }

    // Cleanup beim Unmount
    return () => {
      heartbeatService.stop()
    }
  }, [user])

  // Register Funktion
  const register = async (name, email, password, password_confirmation, privacyAccepted) => {
    try {
      const data = await authAPI.register(name, email, password, password_confirmation, privacyAccepted)
      
      return { 
        success: true, 
        userId: data.userId, 
        message: data.message || 'Registrierung erfolgreich!' 
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.error || error.message || 'Registrierung fehlgeschlagen' 
      }
    }
  }

  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password)

      if (data.token) {
        localStorage.setItem('token', data.token)
        setUser(data.user)
        return { success: true }
      }
      
      return { success: false, message: 'Kein Token erhalten' }
    } catch (error) {
      return { success: false, message: error.message || 'Login fehlgeschlagen' }
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      // Fehlerbehandlung, falls nötig
    } finally {
      localStorage.removeItem('token')
      setUser(null)
      // Heartbeat wird automatisch durch useEffect gestoppt
    }
  }

  // ⭐ NEU: Role-Helper-Funktionen
  const isAdmin = () => {
    return user?.role === 'admin'
  }

  const isHost = () => {
    return user?.role === 'host'
  }

  const isGameCreator = () => {
    return user?.role === 'admin' || user?.role === 'host'
  }

  const isPlayer = () => {
    return user?.role === 'player'
  }

  const isBanned = () => {
    return user?.role === 'banned'
  }

  const hasRole = (role) => {
    return user?.role === role
  }

  const canAccessAdmin = () => {
    return isAdmin()
  }

  // ⭐ NEU: isAuthenticated Helper
  const isAuthenticated = !!user

  const value = {
    user,
    register,
    login,
    logout,
    loading,
    isAuthenticated,      // ⭐ NEU
    isAdmin,              // ⭐ NEU
    isHost,               // ⭐ NEU
    isGameCreator,        // ⭐ NEU
    isPlayer,             // ⭐ NEU
    isBanned,             // ⭐ NEU
    hasRole,              // ⭐ NEU
    canAccessAdmin,       // ⭐ NEU
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    // Fallback für den Fall, dass der Provider noch nicht bereit ist
    return {
      user: null,
      logout: () => {},
      loading: true,
      isAdmin: false,
      register: () => {},
      login: () => {},
      verifyEmail: () => {},
      resendVerification: () => {},
      forgotPassword: () => {},
      resetPassword: () => {},
      changePassword: () => {}
    }
  }
  return context
}
