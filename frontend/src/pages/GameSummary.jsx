// src/pages/GameSummary.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useBlocker } from 'react-router-dom';
import '../styles/pages/newgame.css';
import { gameAPI } from '../services/api';
import { useUserContext } from '../context/UserContext'; // 🆕 UserContext hinzufügen

function GameSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const { users: availableEmails, loadUsers } = useUserContext(); // 🆕 UserContext verwenden
  
  // Daten aus Navigation State holen
  const { gameName, playerCount, players, victoryPoints } = location.state || {};

  // 🆕 User-Daten beim Mount laden
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // 🆕 Schutz vor Datenverlust
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true);

  // Navigation-Blocker für interne Navigation
  const blocker = useBlocker(hasUnsavedChanges && localStorage.getItem('gameActive') !== 'true');

  // useEffect für Blocker
  useEffect(() => {
    if (blocker.state === 'blocked') {
      const confirmLeave = window.confirm(
        'Du hast ein Spiel in Bearbeitung. Möchtest du wirklich die Seite verlassen? Die Spieldaten gehen verloren.'
      );
      if (confirmLeave) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker]);

  // 🆕 beforeunload für Browser-Exit
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges && localStorage.getItem('gameActive') !== 'true') {
        e.preventDefault();
        e.returnValue = 'Du hast ein Spiel in Bearbeitung. Möchtest du wirklich die Seite verlassen? Die Spieldaten gehen verloren.';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Fallback: Wenn keine Daten vorhanden (direkter Zugriff auf URL)
  if (!gameName || !players) {
    return (
      <div className="newgame">
        <div className="newgame__form">
          <div className="error-state">
            <p>Keine Spieldaten gefunden</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/new-game')}
            >
              Zurück zum Formular
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtere nur die tatsächlich ausgefüllten Spieler
  const activePlayers = players.slice(0, playerCount).filter(p => p);

  // 🆕 Korrekte Zählung: Prüfe ob E-Mail zu registrierten Usern gehört
  const isRegisteredUser = (email) => {
    return availableEmails.some(user => user.email === email);
  };

  const registeredCount = activePlayers.filter(p => p.email && isRegisteredUser(p.email)).length;
  const newUserCount = activePlayers.filter(p => p.email && !isRegisteredUser(p.email)).length;
  const guestCount = activePlayers.filter(p => !p.email).length;

  return (
    <div className="newgame">
      <div className="newgame__form">
        {/* Header */}
        <div className="newgame__header">
          <h1 className="newgame__title">📋 Spielübersicht</h1>
          <p style={{ 
            marginTop: '0.5rem', 
            color: 'var(--text-medium)',
            fontSize: '0.95rem'
          }}>
            Überprüfe alle Angaben vor dem Erstellen
          </p>
        </div>

        {/* FIELDSET 1: BASISDATEN */}
        <fieldset className="form-fieldset">
          <legend className="form-legend">📋 Basisdaten</legend>

          <div className="summary-row">
            <div className="summary-label">Spielname:</div>
            <div className="summary-value summary-value--highlight">
              {gameName}
            </div>
          </div>

          <div className="summary-row">
            <div className="summary-label">🏆 Siegbedingung:</div>
            <div className="summary-value summary-value--highlight">
              {victoryPoints} Punkte
            </div>
          </div>

          <div className="summary-row">
            <div className="summary-label">Anzahl Spieler:</div>
            <div className="summary-value">
              {playerCount} Spieler
              <span className="summary-badge">
                {registeredCount} registriert, {newUserCount} neue User, {guestCount} Gäste
              </span>
            </div>
          </div>
        </fieldset>

        {/* FIELDSET 2: SPIELERLISTE */}
        <fieldset className="form-fieldset">
          <legend className="form-legend">👥 Spielerliste</legend>

          <div className="summary-players">
            {activePlayers.map((player, index) => (
              <div key={index} className="summary-player">
                <div className="summary-player__number">
                  #{player.playerNumber}
                </div>
                <div className="summary-player__info">
                  <div className="summary-player__name">
                    {player.name}
                  </div>
                  {player.email && (
                    <div className="summary-player__email">
                      {player.email}
                    </div>
                  )}
                </div>
                <div className="summary-player__badge">
                  {player.playerNumber === 1 ? (
                    <span className="player-badge player-badge--current">
                      Du
                    </span>
                  ) : player.email ? (
                    isRegisteredUser(player.email) ? (
                      <span className="player-badge player-badge--registered">
                        Registriert
                      </span>
                    ) : (
                      <span className="player-badge player-badge--new">
                        Neuer User?
                      </span>
                    )
                  ) : (
                    <span className="player-badge player-badge--guest">
                      Gast
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </fieldset>

        {/* INFO BOX */}
        <div className="summary-info-box">
          <div className="summary-info-box__icon">💡</div>
          <div className="summary-info-box__content">
            <strong>Was passiert als Nächstes?</strong>
            <ul>
              <li>Das Spiel wird in der Datenbank erstellt</li>
              <li>Alle registrierten Spieler erhalten eine E-Mail-Benachrichtigung</li>
              <li>Du wirst zur Spielansicht weitergeleitet</li>
            </ul>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setHasUnsavedChanges(false); // 🆕 Schutz deaktivieren für Zurück-Navigation
              navigate('/new-game', { 
                state: { gameName, playerCount, players, victoryPoints } 
              });
            }}
          >
            ← Zurück bearbeiten
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={async () => {
              try {
                // API-Call zum Erstellen des Spiels
                const gameData = {
                  gameName,
                  players: activePlayers.map(p => ({
                    name: p.name,
                    email: p.email || null,
                    userId: p.userId || null
                  })),
                  victoryCondition: victoryPoints
                };
                
                // Spiel über API erstellen
                const response = await gameAPI.createGame(gameData);
                
                if (!response || !response.id) {
                  throw new Error('Spiel konnte nicht erstellt werden');
                }
                
                // Navigation zur Game-Seite mit der Spiel-ID
                setHasUnsavedChanges(false); // 🆕 Schutz deaktivieren für Spiel-Start
                localStorage.setItem('gameActive', 'true'); // Spiel als aktiv markieren
                
                // Navigation zur Game-Seite mit der Spiel-ID
                setHasUnsavedChanges(false); // 🆕 Schutz deaktivieren für Spiel-Start
                localStorage.setItem('gameActive', 'true'); // Spiel als aktiv markieren
                navigate(`/game/${response.id}`);
              } catch (error) {
                console.error('❌ Fehler beim Erstellen des Spiels:', error);
                console.error('❌ Error details:', error.message, error.response);
                alert('Fehler beim Erstellen des Spiels: ' + error.message);
              }
            }}
          >
            Spiel starten 🎮
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameSummary;
