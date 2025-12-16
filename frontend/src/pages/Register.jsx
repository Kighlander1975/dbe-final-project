// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLoading } from '../context/LoadingContext';
import '../styles/pages/forms.css';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();
  const { startLoading, stopLoading } = useLoading();

  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    privacyAccepted: false,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    startLoading('Registrierung läuft...');

    if (!formData.name || !formData.email || !formData.password || !formData.password_confirmation) {
      setError('Bitte fülle alle Felder aus');
      setLoading(false);
      stopLoading();
      return;
    }

    if (!formData.privacyAccepted) {
      setError('Bitte akzeptiere die Datenschutzbestimmungen');
      setLoading(false);
      stopLoading();
      return;
    }

    if (formData.password.length < 8) {
      setError('Passwort muss mindestens 8 Zeichen lang sein');
      setLoading(false);
      stopLoading();
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setError('Passwörter stimmen nicht überein');
      setLoading(false);
      stopLoading();
      return;
    }

    // Register
    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.password_confirmation,
      formData.privacyAccepted
    );

    if (result.success) {
      setSuccess('Registrierung erfolgreich! Bitte überprüfe deine E-Mails und verifiziere deine Adresse.');
      showToast('Bitte verifiziere deine E-Mail-Adresse!', 'info', 8000);
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else {
      setError(result.message);
      stopLoading();
    }

    setLoading(false);
  };

  return (
    <div className="register">
      <div className="register__container">
        <h1 className="register__title">📝 Registrierung</h1>
        <p className="register__subtitle">Erstelle deinen Account</p>

        {/* Success-Message */}
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

        {/* Error-Message */}
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
              disabled={loading || success}
              autoComplete="off"
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
              disabled={loading || success}
              autoComplete="off"
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
              disabled={loading || success}
              autoComplete="new-password"
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
              disabled={loading || success}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="privacyAccepted"
                checked={formData.privacyAccepted}
                onChange={handleChange}
                disabled={loading || success}
                required
              />
              <span className="checkmark"></span>
              Ich akzeptiere die{' '}
              <button
                type="button"
                className="privacy-link"
                onClick={() => setShowPrivacyModal(true)}
                disabled={loading || success}
              >
                Datenschutzbestimmungen
              </button>
            </label>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading || success}
            >
              {loading ? 'Registrieren...' : success ? 'Weiterleitung...' : 'Registrieren'}
            </button>
          </div>
        </form>

        <div className="form-link">
          Schon registriert? <Link to="/login">Zum Login</Link>
        </div>
      </div>

      {/* Datenschutzerklärung Modal */}
      {showPrivacyModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Datenschutzerklärung</h2>
            </div>
            <div className="modal-body modal-body-scroll">
              <h3>1. Verantwortlicher</h3>
              <p>
                Verantwortlich für die Datenverarbeitung ist der im <b>Impressum</b> genannte Betreiber dieser Anwendung.
              </p>
              <h3>2. Zwecke und Rechtsgrundlagen der Datenverarbeitung</h3>
              <ul>
                <li>Bereitstellung und Betrieb der App (Art. 6 Abs. 1 lit. b DSGVO)</li>
                <li>Authentifizierung und Verwaltung von Nutzerkonten (Art. 6 Abs. 1 lit. b DSGVO)</li>
                <li>Führen von Ranglisten und Spielstatistiken (Art. 6 Abs. 1 lit. f DSGVO, berechtigtes Interesse)</li>
                <li>Erfüllung gesetzlicher Aufbewahrungspflichten (Art. 6 Abs. 1 lit. c DSGVO)</li>
              </ul>
              <h3>3. Erhobene Daten</h3>
              <ul>
                <li><b>E-Mail-Adresse</b> (bei Registrierung): Authentifizierung, Accountverwaltung, Wiederherstellung</li>
                <li><b>Name/Alias</b>: Anzeige im Spiel, Ranglisten</li>
                <li><b>Passwort</b>: Nur gehasht gespeichert</li>
                <li><b>Spielverläufe & Statistiken</b>: Zuordnung zu User-ID, für 2 Jahre gespeichert</li>
                <li><b>Geräte-/Nutzungsdaten</b>: Nur technisch notwendige Daten (z.B. Session, Cookies)</li>
              </ul>
              <h3>4. Speicherdauer und Löschung</h3>
              <ul>
                <li>Accountdaten: Bis zur Löschung des Accounts, danach E-Mail & User-ID für 2 Jahre (Ranglisten-Konsistenz, Wiederherstellung)</li>
                <li>Spielverläufe: 2 Jahre ab Spielende, dann automatische Löschung</li>
                <li>Ranglisten: Dauerhaft, aber nach Account-Löschung anonymisiert („Anonymer Nutzer")</li>
                <li>Backups: Maximal 30 Tage</li>
              </ul>
              <h3>5. Betroffenenrechte</h3>
              <ul>
                <li>Auskunft über gespeicherte Daten (Art. 15 DSGVO)</li>
                <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
                <li>Löschung („Recht auf Vergessenwerden", Art. 17 DSGVO)</li>
                <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                <li>Widerspruch gegen Verarbeitung (Art. 21 DSGVO)</li>
                <li>Beschwerderecht bei einer Aufsichtsbehörde</li>
              </ul>
              <h3>6. Weitergabe von Daten</h3>
              <p>
                Es erfolgt keine Weitergabe Ihrer Daten an Dritte, außer es besteht eine gesetzliche Pflicht oder Sie haben ausdrücklich eingewilligt.
              </p>
              <h3>7. Technische und organisatorische Maßnahmen</h3>
              <ul>
                <li>Passwort-Hashing (bcrypt)</li>
                <li>Soft-Delete mit 30-Tage-Frist</li>
                <li>Automatische Löschung von Spielverläufen</li>
                <li>Zugriffsbeschränkungen für Admins</li>
                <li>Regelmäßige Backups (max. 30 Tage)</li>
                <li>CSRF-Schutz, Authentifizierung via Sanctum</li>
                <li>Logging und Monitoring von Löschvorgängen</li>
              </ul>
              <h3>8. Kontakt</h3>
              <p>
                Für Fragen zum Datenschutz wenden Sie sich bitte an den im <b>Impressum</b> genannten Kontakt.
              </p>
              <p className="modal-note">
                Stand: 15.12.2025 – Diese Datenschutzerklärung wird regelmäßig aktualisiert.
              </p>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="btn btn-primary"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
