// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import '../styles/pages/forms.css';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // ⭐ NEU
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess(''); // ⭐ NEU
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(''); // ⭐ NEU
    setLoading(true);

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.password_confirmation) {
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

    // Register
    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.password_confirmation
    );

    if (result.success) {
      // ⭐ Success-Message anzeigen
      setSuccess('✅ Registrierung erfolgreich! Bitte überprüfe deine E-Mails und verifiziere deine Adresse.');
      
      // ⭐ Toast anzeigen
      showToast('📧 Bitte verifiziere deine E-Mail-Adresse!', 'info', 8000);
      
      // ⭐ Nach 3 Sekunden zum Login
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else {
      // ⭐ Fehler bleibt als rote Box
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="register">
      <div className="register__container">
        <h1 className="register__title">📝 Registrierung</h1>
        <p className="register__subtitle">Erstelle deinen Account</p>

        {/* ⭐ Success-Message */}
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
            {success}
          </div>
        )}

        {/* ⭐ Error-Message */}
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
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Dein Name"
              disabled={loading || success} // ⭐ Auch bei Success disablen
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-Mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="deine@email.de"
              disabled={loading || success} // ⭐ Auch bei Success disablen
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Passwort</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={loading || success} // ⭐ Auch bei Success disablen
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
              placeholder="••••••••"
              disabled={loading || success} // ⭐ Auch bei Success disablen
              required
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading || success} // ⭐ Auch bei Success disablen
            >
              {loading ? 'Registrieren...' : success ? 'Weiterleitung...' : 'Registrieren'}
            </button>
          </div>
        </form>

        <div className="form-link">
          Schon registriert? <Link to="/login">Zum Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;