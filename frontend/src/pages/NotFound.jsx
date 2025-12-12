// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/notfound.css';

function NotFound() {
  return (
    <div className="notfound">
      <div className="notfound__container">
        <div className="notfound__icon">🔍</div>
        <h1 className="notfound__title">Seite nicht gefunden</h1>
        <p className="notfound__message">
          Die gesuchte Seite existiert nicht oder wurde verschoben.
        </p>
        <p className="notfound__hint">
          Überprüfen Sie die URL oder kehren Sie zur Startseite zurück.
        </p>
        <div className="notfound__actions">
          <Link to="/" className="notfound__button notfound__button--primary">
            🏠 Zur Startseite
          </Link>
          <button
            onClick={() => window.history.back()}
            className="notfound__button notfound__button--secondary"
          >
            ← Zurück
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;