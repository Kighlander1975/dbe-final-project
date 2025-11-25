// src/pages/ChangePassword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext'; // ✅ NEU
import '../styles/pages/forms.css';

function ChangePassword() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const { startLoading, stopLoading } = useLoading(); // ✅ NEU

  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // ✅ SOFORT Loading starten
    startLoading('Passwort wird geändert...');

    // Validation
    if (!formData.current_password || !formData.new_password || !formData.new_password_confirmation) {
      setError('Bitte fülle alle Felder aus');
      setLoading(false);
      stopLoading(); // ✅ NEU
      return;
    }

    if (formData.new_password.length < 8) {
      setError('Das neue Passwort muss mindestens 8 Zeichen lang sein');
      setLoading(false);
      stopLoading(); // ✅ NEU
      return;
    }

    if (formData.new_password !== formData.new_password_confirmation) {
      setError('Die neuen Passwörter stimmen nicht überein');
      setLoading(false);
      stopLoading(); // ✅ NEU
      return;
    }

    if (formData.current_password === formData.new_password) {
      setError('Das neue Passwort darf nicht mit dem alten übereinstimmen');
      setLoading(false);
      stopLoading(); // ✅ NEU
      return;
    }

    try {
      const response = await authAPI.changePassword(
        formData.current_password,
        formData.new_password,
        formData.new_password_confirmation
      );

      showToast('✅ ' + response.message, 'success', 6000);
      
      // Form zurücksetzen
      setFormData({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      });

      // Nach 2 Sekunden zur Startseite
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Ein Fehler ist aufgetreten');
      showToast('❌ ' + (err.message || 'Fehler beim Ändern'), 'error');
      stopLoading(); // ✅ NEU: Bei Fehler stoppen
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="register__container">
        <h1 className="register__title">🔐 Passwort ändern</h1>
        <p className="register__subtitle">
          Hallo <strong>{user?.name}</strong>, ändere hier dein Passwort
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
          backgroundColor: '#e3f2fd',
          color: '#1565c0',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.9rem',
          border: '1px solid #90caf9',
        }}>
          <strong>💡 Tipp:</strong> Verwende ein sicheres Passwort mit mindestens 8 Zeichen.
        </div>

        <form onSubmit={handleSubmit}>
          {/* Aktuelles Passwort */}
          <div className="form-group">
            <label htmlFor="current_password">Aktuelles Passwort</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPasswords.current ? 'text' : 'password'}
                id="current_password"
                name="current_password"
                value={formData.current_password}
                onChange={handleChange}
                placeholder="Dein aktuelles Passwort"
                disabled={loading}
                required
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  padding: '0.25rem',
                  opacity: 0.6,
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.opacity = 1}
                onMouseLeave={(e) => e.target.style.opacity = 0.6}
              >
                {showPasswords.current ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Neues Passwort */}
          <div className="form-group">
            <label htmlFor="new_password">Neues Passwort</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPasswords.new ? 'text' : 'password'}
                id="new_password"
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                placeholder="Mindestens 8 Zeichen"
                disabled={loading}
                required
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  padding: '0.25rem',
                  opacity: 0.6,
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.opacity = 1}
                onMouseLeave={(e) => e.target.style.opacity = 0.6}
              >
                {showPasswords.new ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {formData.new_password && (
              <small style={{ 
                color: formData.new_password.length >= 8 ? '#2e7d32' : '#d32f2f',
                fontSize: '0.85rem',
                marginTop: '0.25rem',
                display: 'block',
              }}>
                {formData.new_password.length >= 8 ? '✅' : '❌'} {formData.new_password.length}/8 Zeichen
              </small>
            )}
          </div>

          {/* Neues Passwort bestätigen */}
          <div className="form-group">
            <label htmlFor="new_password_confirmation">Neues Passwort bestätigen</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                id="new_password_confirmation"
                name="new_password_confirmation"
                value={formData.new_password_confirmation}
                onChange={handleChange}
                placeholder="Passwort wiederholen"
                disabled={loading}
                required
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  padding: '0.25rem',
                  opacity: 0.6,
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.opacity = 1}
                onMouseLeave={(e) => e.target.style.opacity = 0.6}
              >
                {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {formData.new_password_confirmation && (
              <small style={{ 
                color: formData.new_password === formData.new_password_confirmation ? '#2e7d32' : '#d32f2f',
                fontSize: '0.85rem',
                marginTop: '0.25rem',
                display: 'block',
              }}>
                {formData.new_password === formData.new_password_confirmation ? '✅ Passwörter stimmen überein' : '❌ Passwörter stimmen nicht überein'}
              </small>
            )}
          </div>

          <div className="form-actions">
            <button 
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Abbrechen
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Wird gespeichert...' : 'Passwort ändern'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
