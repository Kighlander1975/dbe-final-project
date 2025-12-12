// src/pages/Forbidden.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/forbidden.css';

function Forbidden() {
  return (
    <div className="forbidden">
      <div className="forbidden__container">
        <div className="forbidden__icon">🚫</div>
        <h1 className="forbidden__title">Zugriff verweigert</h1>
        <p className="forbidden__message">
          Du hast keine Berechtigung, diese Seite aufzurufen.
        </p>
        <p className="forbidden__hint">
          Wenn du glaubst, dass dies ein Fehler ist, kontaktiere bitte einen Administrator.
        </p>
        <div className="forbidden__actions">
          <Link to="/" className="forbidden__button forbidden__button--primary">
            🏠 Zur Startseite
          </Link>
          <Link to="/login" className="forbidden__button forbidden__button--secondary">
            🔐 Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Forbidden;