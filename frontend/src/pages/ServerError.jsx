// src/pages/ServerError.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/servererror.css';

function ServerError() {
  return (
    <div className="servererror">
      <div className="servererror__container">
        <div className="servererror__icon">!</div>
        <h1 className="servererror__title">Server-Fehler</h1>
        <p className="servererror__message">
          Es ist ein unerwarteter Fehler aufgetreten.
        </p>
        <p className="servererror__hint">
          Bitte versuchen Sie es später erneut oder kontaktieren Sie den Support, falls das Problem bestehen bleibt.
        </p>
        <div className="servererror__actions">
          <button
            onClick={() => window.location.reload()}
            className="servererror__button servererror__button--primary"
          >
            🔄 Seite neu laden
          </button>
          <Link to="/" className="servererror__button servererror__button--secondary">
            🏠 Zur Startseite
          </Link>
        </div>
        <div className="servererror__details">
          <details>
            <summary>Technische Details (für Support)</summary>
            <div className="servererror__tech-info">
              <p><strong>Zeitstempel:</strong> {new Date().toLocaleString('de-DE')}</p>
              <p><strong>URL:</strong> {window.location.href}</p>
              <p><strong>User-Agent:</strong> {navigator.userAgent}</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

export default ServerError;