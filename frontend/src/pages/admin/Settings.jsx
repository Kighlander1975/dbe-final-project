import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { adminAPI } from '../../services/api';
import '../../styles/pages/admin/settings.css';

function Settings() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [version, setVersion] = useState('1.0');
    const [debugServerErrors, setDebugServerErrors] = useState(false);
    const [countUpDuration, setCountUpDuration] = useState(2.0);
    const [originalCountUpDuration, setOriginalCountUpDuration] = useState(2.0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchVersion();
    }, []);

    const fetchVersion = async () => {
        try {
            const response = await adminAPI.getSettings();
            const versionSetting = response.settings.find(setting => setting.key === 'version');
            if (versionSetting) {
                setVersion(versionSetting.value);
            }
            
            const debugSetting = response.settings.find(setting => setting.key === 'debug_server_error');
            if (debugSetting) {
                setDebugServerErrors(debugSetting.value === 'true');
            }

            const countUpSetting = response.settings.find(setting => setting.key === 'count_up_duration');
            if (countUpSetting) {
                const value = parseFloat(countUpSetting.value);
                setCountUpDuration(value);
                setOriginalCountUpDuration(value);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            showToast('Fehler beim Laden der Einstellungen', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveVersion = async () => {
        if (!version.trim()) {
            showToast('Version ist erforderlich', 'error');
            return;
        }

        setSaving(true);
        try {
            await adminAPI.updateSetting('version', { value: version });
            showToast('Version aktualisiert', 'success');
            
            // ⭐ Refresh version in header
            if (window.refreshAppVersion) {
                window.refreshAppVersion();
            }
        } catch (error) {
            console.error('Error saving version:', error);
            showToast('Fehler beim Speichern der Version', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDebugServerErrorsChange = async (value) => {
        try {
            await adminAPI.updateSetting('debug_server_error', { value: value.toString() });
            setDebugServerErrors(value);
            showToast('Debug-Einstellung aktualisiert', 'success');
            
            // ⭐ Refresh debug mode in header
            if (window.refreshDebugMode) {
                window.refreshDebugMode();
            }
            
            // ⭐ Reload page to apply changes
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('Error saving debug setting:', error);
            showToast('Fehler beim Speichern der Debug-Einstellung', 'error');
        }
    };

    const handleCountUpDurationChange = async () => {
        if (countUpDuration === originalCountUpDuration) {
            showToast('Keine Änderungen vorhanden', 'info');
            return;
        }

        try {
            await adminAPI.updateSetting('count_up_duration', { value: countUpDuration.toString() });
            setOriginalCountUpDuration(countUpDuration);
            showToast('Count-Up-Duration aktualisiert', 'success');
        } catch (error) {
            console.error('Error saving count-up duration:', error);
            showToast('Fehler beim Speichern der Count-Up-Duration', 'error');
        }
    };

    const handleResetRankings = async () => {
        const confirmed = window.confirm(
            '⚠️ WARNUNG: Diese Aktion kann nicht rückgängig gemacht werden!\n\n' +
            'Alle Spieler-Rankings, Punkte und Statistiken werden dauerhaft gelöscht.\n' +
            'Außerdem werden alle beendeten Spiele entfernt.\n\n' +
            'Bist du sicher, dass du fortfahren möchtest?'
        );

        if (!confirmed) {
            return;
        }

        setSaving(true);
        try {
            await adminAPI.resetRankings();
            showToast('Alle Rankings wurden erfolgreich zurückgesetzt', 'success');
        } catch (error) {
            console.error('Error resetting rankings:', error);
            showToast('Fehler beim Zurücksetzen der Rankings', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-settings">
                <div className="loading">⚙️ Lade Version...</div>
            </div>
        );
    }

    return (
        <div className="admin-settings">
            <h1 className="admin-settings__title">⚙️ Einstellungen</h1>
            <p className="admin-settings__subtitle">
                App-Version verwalten
            </p>

            <div className="admin-settings__section">
                <h2>App-Version</h2>
                <div className="version-control">
                    <div className="version-input-group">
                        <label htmlFor="version">Version:</label>
                        <input
                            id="version"
                            type="text"
                            value={version}
                            onChange={(e) => setVersion(e.target.value)}
                            placeholder="z.B. 1.0.3"
                            className="version-input"
                        />
                    </div>
                    <button
                        onClick={handleSaveVersion}
                        disabled={saving}
                        className="btn btn-primary version-save-btn"
                    >
                        {saving ? 'Speichere...' : 'Speichern'}
                    </button>
                </div>
            </div>

            <div className="admin-settings__section">
                <h2>Debug-Einstellungen</h2>
                <div className="debug-control">
                    <div className="debug-input-group">
                        <label>Server-Fehler Debuggen:</label>
                        <div className="radio-group">
                            <label className="radio-option">
                                <input
                                    type="radio"
                                    name="debugServerErrors"
                                    checked={debugServerErrors === true}
                                    onChange={() => handleDebugServerErrorsChange(true)}
                                />
                                <span>An</span>
                            </label>
                            <label className="radio-option">
                                <input
                                    type="radio"
                                    name="debugServerErrors"
                                    checked={debugServerErrors === false}
                                    onChange={() => handleDebugServerErrorsChange(false)}
                                />
                                <span>Aus</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="admin-settings__section">
                <h2>Visuelle Einstellungen</h2>
                <div className="visual-control">
                    <div className="visual-input-group">
                        <label htmlFor="countUpDuration">Count-Up-Duration (Sekunden):</label>
                        <input
                            id="countUpDuration"
                            type="number"
                            min="0.5"
                            max="2.0"
                            step="0.1"
                            value={countUpDuration}
                            onChange={(e) => setCountUpDuration(parseFloat(e.target.value))}
                            className="visual-input"
                        />
                    </div>
                    <button
                        onClick={handleCountUpDurationChange}
                        disabled={saving}
                        className="btn btn-primary visual-save-btn"
                    >
                        {saving ? 'Speichere...' : 'Speichern'}
                    </button>
                </div>
            </div>

            <div className="admin-settings__section">
                <h2>Daten-Reset</h2>
                <div className="reset-control">
                    <div className="reset-warning">
                        <p><strong>⚠️ Achtung:</strong> Diese Aktion kann nicht rückgängig gemacht werden!</p>
                        <p>Alle Spieler-Rankings, Punkte und Statistiken werden dauerhaft gelöscht.</p>
                        <p>Außerdem werden alle beendeten Spiele entfernt.</p>
                        <p>Verwende dies nur für Testzwecke oder nach Backup.</p>
                    </div>
                    <button
                        onClick={handleResetRankings}
                        disabled={saving}
                        className="btn btn-danger reset-btn"
                    >
                        {saving ? 'Setze zurück...' : '🗑️ Rankings zurücksetzen'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Settings;