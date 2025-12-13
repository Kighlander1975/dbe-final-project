import React, { useState } from 'react';
import { adminAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useLoading } from '../../context/LoadingContext';
import '../../styles/pages/admin/test-email.css';

const TestEmail = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();
    const { startLoading, stopLoading } = useLoading();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            showToast('Bitte gib eine E-Mail-Adresse ein', 'error');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showToast('Bitte gib eine gültige E-Mail-Adresse ein', 'error');
            return;
        }

        setIsLoading(true);
        startLoading('Sende Test-E-Mail...');

        try {
            const response = await adminAPI.sendTestEmail(email);
            showToast('Test-E-Mail wurde erfolgreich gesendet!', 'success');
            setEmail('');
        } catch (error) {
            console.error('Test email error:', error);
            const message = error.response?.data?.message || error.message || 'Unbekannter Fehler';
            showToast(`Fehler beim Senden der Test-E-Mail: ${message}`, 'error');
        } finally {
            setIsLoading(false);
            stopLoading();
        }
    };

    return (
        <div className="test-email">
            <h1 className="test-email__title">📧 E-Mail-Test</h1>
            <p className="test-email__subtitle">
                Teste die E-Mail-Konfiguration, indem du eine Test-E-Mail an eine beliebige Adresse sendest.
            </p>

            <div className="test-email__card">
                <form onSubmit={handleSubmit} className="test-email__form">
                    <div className="test-email__field">
                        <label htmlFor="email" className="test-email__label">
                            E-Mail-Adresse:
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="test@example.com"
                            className="test-email__input"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="test-email__button"
                        disabled={isLoading || !email.trim()}
                    >
                        {isLoading ? '📤 Sende...' : '📧 Test-E-Mail senden'}
                    </button>
                </form>

                <div className="test-email__info">
                    <h3>💡 Hinweise:</h3>
                    <ul>
                        <li>Die E-Mail wird mit dem konfigurierten SMTP-Server gesendet.</li>
                        <li>Prüfe die Laravel-Logs bei Fehlern: <code>storage/logs/laravel.log</code></li>
                        <li>Stelle sicher, dass die Mail-Konfiguration in <code>.env</code> korrekt ist.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TestEmail;