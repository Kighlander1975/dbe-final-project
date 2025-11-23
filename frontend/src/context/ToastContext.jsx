// src/context/ToastContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react'
import Toast from '../components/Toast'
import '../styles/components/toasts.css' // ⭐ CSS importieren

const ToastContext = createContext()

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info', duration = 6000) => {
    const id = Date.now() + Math.random()
    
    setToasts(prev => {
      const exists = prev.some(toast => toast.message === message)
      if (exists) return prev
      
      return [...prev, { id, message, type, duration }]
    })
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* ⭐ Toast-Container mit CSS-Klasse */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}