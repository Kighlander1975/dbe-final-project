// src/pages/VerifyEmail.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import '../styles/pages/forms.css';

function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Kein Verifizierungs-Token gefunden.');
      return;
    }

    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await authAPI.verifyEmail(token);
      setStatus('success');
      setMessage(response.message || 'E-Mail erfolgreich verifiziert!');
      
      // Nach 3 Sekunden zum Login
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Verifizierung fehlgeschlagen.');
    }
  };

  return (
    <div className="verify-email">
      <div className="verify-email__container">
        <h1 className="verify-email__title">
          {status === 'loading' && '⏳ Verifizierung läuft...'}
          {status === 'success' && '✅ E-Mail verifiziert!'}
          {status === 'error' && '❌ Verifizierung fehlgeschlagen'}
        </h1>

        {status === 'loading' && (
          <p className="verify-email__subtitle">
            Bitte warten, deine E-Mail-Adresse wird verifiziert...
          </p>
        )}

        {status === 'success' && (
          <>
            <div className="success-message">
              {message}
            </div>
            <p className="verify-email__subtitle">
              Du wirst in Kürze zum Login weitergeleitet...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="error-message">
              {message}
            </div>
            <div className="form-link">
              <Link to="/login">Zurück zum Login</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
