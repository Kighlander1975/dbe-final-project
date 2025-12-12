// src/pages/Home.jsx
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useUserContext } from '../context/UserContext' // 🆕 UserContext
import { gameAPI } from '../services/api' // ⭐ Game API
import '../styles/pages/home.css'

function Home() {
  const { user, isAdmin } = useAuth() // ✅ isAdmin hinzugefügt
  const { showToast } = useToast()
  const navigate = useNavigate()
  const { loadUsers } = useUserContext() // 🆕 UserContext

  // ✅ isAuthenticated basiert auf user
  const isAuthenticated = !!user

  // ⭐ State für aktives Spiel
  const [activeGame, setActiveGame] = useState(null)
  const [checkingGame, setCheckingGame] = useState(false)

  // 🆕 User-Liste beim Mount neu laden
  useEffect(() => {
    loadUsers(true); // force = true, um Cache zu überschreiben
  }, [loadUsers]);

  // ⭐ Aktives Spiel beim Mount laden (nur für Admins)
  useEffect(() => {
    const loadActiveGame = async () => {
      if (isAuthenticated && isAdmin()) {
        setCheckingGame(true);
        try {
          const response = await gameAPI.hasActiveGame();
          setActiveGame(response.hasActiveGame ? response.activeGame : null);
        } catch (error) {
          console.error('Failed to load active game:', error);
          setActiveGame(null);
        } finally {
          setCheckingGame(false);
        }
      } else {
        setActiveGame(null);
        setCheckingGame(false);
      }
    };

    loadActiveGame();
  }, [isAuthenticated, isAdmin]);

  // Handler für geschützte Links
  const handleProtectedLink = (e, path) => {
    if (!isAuthenticated) {
      e.preventDefault()
      showToast('🔒 Bitte melde dich an, um fortzufahren', 'warning', 6000)
      navigate('/login')
    }
  }

  // ⭐ Handler für Spiel fortsetzen
  const handleResumeGame = async () => {
    if (!activeGame) return;

    try {
      // Hier würde man normalerweise eine API-Funktion aufrufen, um den Status zu ändern
      // Aber da wir das noch nicht haben, navigieren wir einfach zum Spiel
      navigate(`/game/${activeGame.id}`);
    } catch (error) {
      console.error('Failed to resume game:', error);
      showToast('❌ Fehler beim Fortsetzen des Spiels', 'error');
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
          
          {/* ⭐ Dynamische Spiel-Buttons basierend auf Status */}
          {isAuthenticated && isAdmin() && !checkingGame && (
            <>
              {activeGame ? (
                <>
                  <li>
                    <Link 
                      to={`/game/${activeGame.id}`}
                      className="home__link--game"
                    >
                      🎯 Spiel "{activeGame.gameName}" {activeGame.status === 'paused' ? 'fortsetzen' : 'weiterführen'}
                    </Link>
                  </li>
                  {activeGame.status === 'paused' && (
                    <li>
                      <Link 
                        to="/new-game"
                        className="home__link--new-game"
                      >
                        🎮 Neues Spiel
                      </Link>
                    </li>
                  )}
                </>
              ) : (
                <li>
                  <Link 
                    to="/new-game"
                    className="home__link--new-game"
                  >
                    🎮 Neues Spiel
                  </Link>
                </li>
              )}
            </>
          )}
          
          {/* Admin Dashboard nur für Admins */}
          {isAuthenticated && isAdmin() && (
            <li>
              <Link to="/admin">⚙️ Admin Dashboard</Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  )
}

export default Home