// src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import '../styles/pages/forms.css';

function ResetPassword() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    token: '',
    password: '',
    password_confirmation: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.email || !formData.token || !formData.password || !formData.password_confirmation) {
      setError('Bitte fülle alle Felder aus');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Passwort muss mindestens 8 Zeichen lang sein');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setError('Passwörter stimmen nicht überein');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.resetPassword(
        formData.email,
        formData.token,
        formData.password,
        formData.password_confirmation
      );

      showToast('✅ ' + response.message, 'success', 6000);
      
      // Nach 2 Sekunden zum Login
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Ein Fehler ist aufgetreten');
      showToast('❌ ' + (err.message || 'Fehler beim Zurücksetzen'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="register__container">
        <h1 className="register__title">🔐 Neues Passwort setzen</h1>
        <p className="register__subtitle">
          Gib den Token aus der E-Mail und dein neues Passwort ein
        </p>

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

        {/* Info Box */}
        <div style={{
          padding: '1rem',
          marginBottom: '1rem',
          backgroundColor: '#fff3cd',
          color: '#856404',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.9rem',
          border: '1px solid #ffeaa7',
        }}>
          <strong>⚠️ Wichtig:</strong> Der Token ist nur 60 Minuten gültig.
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-Mail-Adresse</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="deine@email.de"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="token">Reset-Token</label>
            <textarea
              id="token"
              name="token"
              value={formData.token}
              onChange={handleChange}
              placeholder="Token aus der E-Mail einfügen"
              disabled={loading}
              required
              style={{
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                minHeight: '80px',
                resize: 'vertical',
              }}
            />
            <small style={{ color: 'var(--text-medium)', fontSize: '0.85rem' }}>
              Kopiere den gesamten Token aus der E-Mail
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="password">Neues Passwort</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mindestens 8 Zeichen"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password_confirmation">Passwort bestätigen</label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              placeholder="Passwort wiederholen"
              disabled={loading}
              required
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Wird gespeichert...' : 'Passwort zurücksetzen'}
            </button>
          </div>
        </form>

        <div className="form-link">
          <Link to="/login">← Zurück zum Login</Link>
        </div>

        <div className="form-link" style={{ marginTop: '0.5rem' }}>
          Noch keinen Token? <Link to="/forgot-password">Reset-Link anfordern</Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
