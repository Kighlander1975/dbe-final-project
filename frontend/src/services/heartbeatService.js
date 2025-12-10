// src/services/heartbeatService.js

import { apiRequest } from './api.js';

class HeartbeatService {
    constructor() {
        this.intervalId = null;
        this.interval = 60 * 60 * 1000; // 1 Stunde in Millisekunden
        this.isActive = false;
    }

    /**
     * Heartbeat starten
     */
    start() {
        if (this.isActive) {
            console.log('🔄 Heartbeat bereits aktiv');
            return;
        }

        console.log('💓 Heartbeat gestartet (alle 1h)');
        this.isActive = true;

        // Sofortiger erster Heartbeat
        this.beat();

        // Regelmäßiger Heartbeat alle 1 Stunde
        this.intervalId = setInterval(() => {
            this.beat();
        }, this.interval);
    }

    /**
     * Heartbeat stoppen
     */
    stop() {
        if (!this.isActive) {
            return;
        }

        console.log('💔 Heartbeat gestoppt');
        this.isActive = false;

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    /**
     * Einzelner Heartbeat
     */
    async beat() {
        try {
            const response = await apiRequest('/heartbeat', {
                loadingMessage: null // Kein Loading-Overlay für Heartbeat
            });

            if (response.status === 'ok') {
                console.log('💓 Heartbeat erfolgreich - Session erneuert');
            }
        } catch (error) {
            console.warn('💔 Heartbeat fehlgeschlagen:', error.message);

            // Bei Auth-Fehler: Heartbeat stoppen (User ist ausgeloggt)
            if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
                console.log('🚪 Heartbeat gestoppt - User nicht mehr eingeloggt');
                this.stop();

                // Optional: Logout-Event triggern oder Seite neu laden
                // window.location.reload();
            }
        }
    }

    /**
     * Status prüfen
     */
    isRunning() {
        return this.isActive;
    }
}

// Singleton-Instanz
const heartbeatService = new HeartbeatService();

export default heartbeatService;