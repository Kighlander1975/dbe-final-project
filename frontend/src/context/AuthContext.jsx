// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react'
import { authAPI } from '../services/api'

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

  // Register Funktion
  const register = async (name, email, password, password_confirmation) => {
    try {
      const data = await authAPI.register(name, email, password, password_confirmation)
      
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
    }
  }

  // ⭐ NEU: Role-Helper-Funktionen
  const isAdmin = () => {
    return user?.role === 'admin'
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
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
