// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useLoading } from '../context/LoadingContext'; // ✅ NEU
import '../styles/pages/forms.css';

function ForgotPassword() {
  const { showToast } = useToast();
  const { startLoading, stopLoading } = useLoading(); // ✅ NEU

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    
    startLoading('Reset-Link wird gesendet...');

    if (!email) {
      setError('Bitte gib deine E-Mail-Adresse ein');
      setLoading(false);
      stopLoading();
      return;
    }

    try {
      const response = await authAPI.forgotPassword(email);
      setSuccess(true);
      showToast('📧 ' + response.message, 'success', 8000);
      setEmail('');
      stopLoading(); // ✅ NEU: Bei Erfolg stoppen
    } catch (err) {
      setError(err.message || 'Ein Fehler ist aufgetreten');
      showToast('❌ ' + (err.message || 'Fehler beim Senden'), 'error');
      stopLoading(); // ✅ NEU: Bei Fehler stoppen
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login__container">
        <h1 className="login__title">🔐 Passwort vergessen?</h1>
        <p className="login__subtitle">
          Gib deine E-Mail-Adresse ein und wir senden dir einen Reset-Link
        </p>

        {/* Success Message */}
        {success && (
          <div style={{
            padding: '1rem',
            marginBottom: '1rem',
            backgroundColor: '#d4edda',
            color: '#155724',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            border: '1px solid #c3e6cb',
          }}>
            <strong>✅ E-Mail versendet!</strong>
            <p style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>
              Prüfe dein Postfach und folge den Anweisungen zum Zurücksetzen deines Passworts.
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{
            padding: '1rem',
            marginBottom: '1rem',
            backgroundColor: '#fee',
            color: '#c33',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-Mail-Adresse</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.de"
              disabled={loading || success}
              required
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading || success}
            >
              {loading ? 'Wird gesendet...' : success ? 'E-Mail gesendet!' : 'Reset-Link senden'}
            </button>
          </div>
        </form>

        <div className="form-link">
          <Link to="/login">← Zurück zum Login</Link>
        </div>

        <div className="form-link" style={{ marginTop: '0.5rem' }}>
          Hast du den Token bereits? <Link to="/reset-password">Passwort zurücksetzen</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
