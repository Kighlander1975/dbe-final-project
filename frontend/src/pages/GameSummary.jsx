// src/pages/GameSummary.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/pages/newgame.css';

function GameSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Daten aus Navigation State holen
  const { gameName, playerCount, players } = location.state || {};

  // Fallback: Wenn keine Daten vorhanden (direkter Zugriff auf URL)
  if (!gameName || !players) {
    return (
      <div className="newgame">
        <div className="newgame__form">
          <div className="error-state">
            <p>❌ Keine Spieldaten gefunden</p>
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

  // Zähle Spieler-Typen
  const registeredCount = activePlayers.filter(p => p.email).length;
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
            <div className="summary-label">Anzahl Spieler:</div>
            <div className="summary-value">
              {playerCount} Spieler
              <span className="summary-badge">
                {registeredCount} registriert, {guestCount} Gäste
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
                    <span className="player-badge player-badge--registered">
                      Registriert
                    </span>
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
            onClick={() => navigate('/new-game', { 
              state: { gameName, playerCount, players } 
            })}
          >
            ← Zurück bearbeiten
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              // TODO: API-Call zum Erstellen des Spiels
              console.log('🎮 Spiel erstellen:', { gameName, playerCount, players });
              alert('🚧 API-Call kommt noch!');
            }}
          >
            Spiel erstellen ✓
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameSummary;
