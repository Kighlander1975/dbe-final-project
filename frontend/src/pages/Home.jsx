// src/pages/Home.jsx
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import '../styles/pages/home.css'

function Home() {
  const { user } = useAuth() // ✅ Nur 'user' verwenden
  const { showToast } = useToast()
  const navigate = useNavigate()

  // ✅ isAuthenticated basiert auf user
  const isAuthenticated = !!user

  // Handler für geschützte Links
  const handleProtectedLink = (e, path) => {
    if (!isAuthenticated) {
      e.preventDefault()
      showToast('🔒 Bitte melde dich an, um fortzufahren', 'warning', 6000)
      navigate('/login')
    }
  }

  return (
    <div className="home">
      <h1 className="home__title">🏠 Startseite</h1>
      <p className="home__subtitle">
        Willkommen beim Stechen Helper{isAuthenticated && user ? `, ${user.name}` : ''}!
      </p>
      
      <nav className="home__nav">
        <ul className="home__menu">
          <li>
            <Link to="/">🏠 Startseite</Link>
          </li>
          
          {!isAuthenticated ? (
            <>
              <li>
                <Link to="/login">🔐 Login</Link>
              </li>
              <li>
                <Link to="/register">📝 Registrierung</Link>
              </li>
            </>
          ) : null}
          
          <li>
            <Link 
              to="/new-game"
              onClick={(e) => handleProtectedLink(e, '/new-game')}
              className={!isAuthenticated ? 'home__link--locked' : ''}
              title={!isAuthenticated ? 'Login erforderlich' : ''}
            >
              🎮 Neues Spiel {!isAuthenticated && '🔒'}
            </Link>
          </li>
          
          <li>
            <Link 
              to="/admin"
              onClick={(e) => handleProtectedLink(e, '/admin')}
              className={!isAuthenticated ? 'home__link--locked' : ''}
              title={!isAuthenticated ? 'Login erforderlich' : ''}
            >
              ⚙️ Admin Dashboard {!isAuthenticated && '🔒'}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Home