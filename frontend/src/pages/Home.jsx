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

  // ⭐ State für User-Spiele (für alle authentifizierten User)
  const [userGames, setUserGames] = useState([])
  const [loadingGames, setLoadingGames] = useState(false)

  // 🆕 User-Liste beim Mount neu laden
  useEffect(() => {
    loadUsers(true); // force = true, um Cache zu überschreiben
  }, [loadUsers]);

  // ⭐ User-Spiele laden Funktion (für alle authentifizierten User)
  const loadUserGames = async () => {
    if (isAuthenticated) {
      setLoadingGames(true);
      try {
        const response = await gameAPI.getUserGames();
        setUserGames(response.games || []);
      } catch (error) {
        console.error('Failed to load user games:', error);
        setUserGames([]);
      } finally {
        setLoadingGames(false);
      }
    } else {
      setUserGames([]);
      setLoadingGames(false);
    }
  };

  // ⭐ User-Spiele beim Mount laden
  useEffect(() => {
    loadUserGames();
  }, [isAuthenticated]);

  // Handler für geschützte Links
  const handleProtectedLink = (e, path) => {
    if (!isAuthenticated) {
      e.preventDefault()
      showToast('🔒 Bitte melde dich an, um fortzufahren', 'warning', 6000)
      navigate('/login')
    }
  }

  // ⭐ Handler für Spiel fortsetzen (jedes Spiel)
  const handleResumeGame = async (game) => {
    try {
      // Prüfen, ob bereits ein anderes Spiel aktiv ist
      const otherActiveGames = userGames.filter(g => g.status === 'active' && g.id !== game.id);
      if (otherActiveGames.length > 0) {
        showToast('⚠️ Ein anderes Spiel ist bereits aktiv. Bitte beende es zuerst.', 'warning', 5000);
        return;
      }

      // Spiel aktivieren
      await gameAPI.resumeGame(game.id);
      showToast('✅ Spiel wurde aktiviert', 'success');

      // Spiele im Hintergrund neu laden (für sofortige UI-Aktualisierung)
      loadUserGames();

      // Zur Game-Seite navigieren (sofort)
      navigate(`/game/${game.id}`);
    } catch (error) {
      console.error('Failed to resume game:', error);
      showToast('❌ Fehler beim Aktivieren des Spiels', 'error');
    }
  }

  // ⭐ Handler für aktives Spiel weiterführen
  const handleContinueGame = (game) => {
    navigate(`/game/${game.id}`);
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
            <Link to="/">
              <div className="home__link-main">🏠 Startseite</div>
            </Link>
          </li>
          
          {!isAuthenticated ? (
            <>
              <li>
                <Link to="/login">
                  <div className="home__link-main">🔐 Login</div>
                </Link>
              </li>
              <li>
                <Link to="/register">
                  <div className="home__link-main">📝 Registrierung</div>
                </Link>
              </li>
            </>
          ) : null}
          
          {/* ⭐ Spiel-Buttons für alle authentifizierten User */}
          {isAuthenticated && !loadingGames && (
            <>
              {/* ⭐ Aktive Spiele (prominent zuerst) */}
              {userGames.filter(game => game.status === 'active').length > 0 && (
                <>
                  <li className="home__section-header">
                    <div className="home__link-main">🎯 Aktive Spiele</div>
                    <div className="home__link-sub">Klicke zum Weiterspielen</div>
                  </li>
                  {userGames.filter(game => game.status === 'active').map((game) => (
                    <li key={game.id}>
                      <button
                        onClick={() => handleContinueGame(game)}
                        className="home__link--with-sub home__link-button home__link-button--active"
                      >
                        <div className="home__link-main">
                          🎯 Spiel weiterführen
                        </div>
                        <div className="home__link-sub">
                          {(() => {
                            const parts = (game.gameName || "").split('_');
                            if (parts.length >= 3) {
                              let timestamp = parseInt(parts[1]);
                              const uuid = parts[2];

                              if (timestamp < 1577836800000) {
                                timestamp *= 1000;
                              }

                              const date = new Date(timestamp);
                              const dateStr = date.toLocaleDateString('de-DE');

                              return `${parts[0]} • ${dateStr}`;
                            }
                            return game.gameName || "Unbekanntes Spiel";
                          })()}
                        </div>
                      </button>
                    </li>
                  ))}
                </>
              )}

              {/* ⭐ Pausierte Spiele (separat) */}
              {userGames.filter(game => game.status === 'paused').length > 0 && (
                <>
                  <li className="home__section-header">
                    <div className="home__link-main">⏸️ Pausierte Spiele</div>
                    <div className="home__link-sub">Klicke zum Fortsetzen</div>
                  </li>
                  {userGames.filter(game => game.status === 'paused').map((game, index) => (
                    <li key={game.id}>
                      <button
                        onClick={() => handleResumeGame(game)}
                        className={`home__link--with-sub home__link-button home__link-button--paused-${(index % 3) + 1}`}
                        disabled={userGames.some(g => g.status === 'active')}
                        title={`Spieler:\n${game.players?.map(p => `${p.rank}. ${p.name}: ${p.points} Pkt`).join('\n') || 'Keine Daten'}`}
                      >
                        <div className="home__link-main">
                          ⏸️ Spiel fortsetzen
                        </div>
                        <div className="home__link-sub">
                          {(() => {
                            const parts = (game.gameName || "").split('_');
                            if (parts.length >= 3) {
                              let timestamp = parseInt(parts[1]);
                              const uuid = parts[2];

                              if (timestamp < 1577836800000) {
                                timestamp *= 1000;
                              }

                              const date = new Date(timestamp);
                              const dateStr = date.toLocaleDateString('de-DE');

                              return `${parts[0]} • ${dateStr}`;
                            }
                            return game.gameName || "Unbekanntes Spiel";
                          })()}
                        </div>
                      </button>
                    </li>
                  ))}
                </>
              )}

              {/* Neues Spiel Button - nur wenn weniger als 3 Spiele */}
              {userGames.length < 3 ? (
                <li>
                  <Link
                    to="/new-game"
                    className={userGames.some(g => g.status === 'active') ? 'home__link-disabled' : ''}
                    onClick={(e) => {
                      if (userGames.some(g => g.status === 'active')) {
                        e.preventDefault();
                        showToast('⚠️ Beende zuerst das aktive Spiel, bevor du ein neues erstellst', 'warning', 5000);
                      }
                    }}
                  >
                    <div className="home__link-main">
                      🎮 Neues Spiel
                      {userGames.length >= 3 && ' (Max. erreicht)'}
                    </div>
                    {userGames.length >= 3 && (
                      <div className="home__link-sub" title="Maximum an offenen Spielen erreicht">
                        Max. 3 Spiele erlaubt
                      </div>
                    )}
                  </Link>
                </li>
              ) : (
                <li>
                  <span className="home__link-disabled" title="Maximum an offenen Spielen erreicht">
                    <div className="home__link-main">🎮 Neues Spiel (Max. erreicht)</div>
                    <div className="home__link-sub">Max. 3 Spiele erlaubt</div>
                  </span>
                </li>
              )}
            </>
          )}

          {/* Lade-Status für Spiele */}
          {isAuthenticated && loadingGames && (
            <li>
              <div className="home__link-main">⏳ Spiele werden geladen...</div>
            </li>
          )}
          
          {/* Admin Dashboard nur für Admins */}
          {isAuthenticated && isAdmin() && (
            <li>
              <Link to="/admin">
                <div className="home__link-main">⚙️ Admin Dashboard</div>
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  )
}

export default Home