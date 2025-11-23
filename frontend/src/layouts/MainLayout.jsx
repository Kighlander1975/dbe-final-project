// src/layouts/MainLayout.jsx
import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import "../styles/layout.css";

function MainLayout() {
  const { user, logout, loading } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    showToast('👋 Erfolgreich abgemeldet!', 'success', 6000)
    navigate('/login')
  }

  return (
    <div className="main-layout">
      <header className="main-layout__header">
        <nav className="main-layout__nav">
          <Link to="/" className="main-layout__logo">
            🎯 Stechen Helper
          </Link>
          
          {/* Zeige Menu nur wenn NICHT loading */}
          {!loading && (
            <ul className="main-layout__menu">
              <li>
                <Link to="/">🏠 Home</Link>
              </li>
              
              {user ? (
                <>
                  <li>
                    <Link to="/new-game">🎮 Neues Spiel</Link>
                  </li>
                  <li>
                    <Link to="/admin">⚙️ Admin</Link>
                  </li>
                  <li>
                    <span style={{ 
                      color: 'rgba(255,255,255,0.9)',
                      padding: '0.5rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      👤 {user.name}
                    </span>
                  </li>
                  <li>
                    <button 
                      onClick={handleLogout}
                      style={{
                        background: 'rgba(255,255,255,0.2)',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                      onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                    >
                      🚪 Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login">🔐 Login</Link>
                  </li>
                  <li>
                    <Link to="/register">📝 Registrieren</Link>
                  </li>
                </>
              )}
            </ul>
          )}

          {/* Zeige Skeleton während loading */}
          {loading && (
            <div style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              padding: '0.5rem 1rem',
            }}>
              <div style={{
                width: '60px',
                height: '20px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '4px',
                animation: 'pulse 1.5s ease-in-out infinite',
              }} />
              <div style={{
                width: '80px',
                height: '20px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '4px',
                animation: 'pulse 1.5s ease-in-out infinite',
              }} />
            </div>
          )}
        </nav>
      </header>

      <main className="main-layout__main">
        <Outlet />
      </main>

      <footer className="main-layout__footer">
        <p>© 2024 Stechen Helper - Alle Rechte vorbehalten</p>
      </footer>

      {/* CSS Animation für Skeleton */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

export default MainLayout;