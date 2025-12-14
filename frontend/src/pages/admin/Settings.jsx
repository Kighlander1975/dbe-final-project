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
        </div>
    );
}

export default Settings;