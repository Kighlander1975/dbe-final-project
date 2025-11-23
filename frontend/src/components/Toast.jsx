// src/components/Toast.jsx
import React, { useEffect } from 'react'
import '../styles/components/toasts.css'

function Toast({ message, type = 'info', onClose, duration = 6000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  // Prüfen, ob die Nachricht bereits mit einem Emoji beginnt
  const startsWithEmoji = /^[\p{Emoji}]/u.test(message);

  // Icons nur anzeigen, wenn die Nachricht nicht bereits mit einem Emoji beginnt
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  }

  return (
    <div className={`toast toast--${type}`}>
      {!startsWithEmoji && <span className="toast__icon">{icons[type]}</span>}
      <span className="toast__message">{message}</span>
      <button className="toast__close" onClick={onClose}>×</button>
    </div>
  )
}

export default Toast