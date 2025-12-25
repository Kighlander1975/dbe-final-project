// src/services/api.js

// API immer auf dem gleichen Host wie das Frontend
// Fallback für lokale Entwicklung: HTTP mit Port 8000
// In Produktion: HTTPS ohne Port
const API_BASE_URL = window.location.hostname === 'localhost'
    ? `http://localhost:8000/api`
    : `https://${window.location.hostname}/api`;

// Diese Funktion wird später durch den tatsächlichen Import ersetzt
// Sie dient nur als Platzhalter, damit wir die Datei nicht direkt importieren müssen
// (was zu zirkulären Abhängigkeiten führen könnte)
let loadingHandlers = {
    startLoading: () => {},
    stopLoading: () => {},
};

// Funktion zum Setzen der Loading-Handler von außen
export function setLoadingHandlers(handlers) {
    loadingHandlers = handlers;
}

// Utility-Funktion zum Parsen von Spielnamen
// Format: "Spielname_Timestamp_UUID" (z.B. "Mein_Spiel_1765873483_574edaca")
export function parseGameName(rawGameName) {
    if (!rawGameName || typeof rawGameName !== 'string') {
        return {
            gameName: 'Unbekanntes Spiel',
            timestamp: null,
            uuid: null,
            formattedDate: 'Unbekannt'
        };
    }

    const parts = rawGameName.split('_');
    
    if (parts.length < 3) {
        // Fallback für alte oder einfache Namen
        return {
            gameName: parts[0] || 'Unbekanntes Spiel',
            timestamp: null,
            uuid: null,
            formattedDate: 'Unbekannt'
        };
    }

    // Rückwärts parsen: UUID ist das letzte Element
    const uuid = parts[parts.length - 1];
    
    // Timestamp ist das vorletzte Element
    const timestampStr = parts[parts.length - 2];
    const timestamp = parseInt(timestampStr, 10);
    
    // Spielname ist alles davor
    const gameNameParts = parts.slice(0, -2);
    const gameName = gameNameParts.join('_').replace(/_/g, ' '); // '_' zurück zu Leerzeichen
    
    // Datum formatieren
    let formattedDate = 'Unbekannt';
    if (!isNaN(timestamp)) {
        const date = new Date(timestamp * 1000);
        formattedDate = date.toLocaleDateString('de-DE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }

    return {
        gameName,
        timestamp,
        uuid,
        formattedDate
    };
}

/**
 * Cookie-Helper: Liest ein Cookie nach Namen
 */
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
}

/**
 * CSRF-Token aus Cookie holen
 */
function getCSRFToken() {
    return getCookie("XSRF-TOKEN");
}

/**
 * Zentrale API-Funktion
 */
async function apiRequest(endpoint, options = {}) {
    // Starte den globalen Ladevorgang, falls nicht übersprungen
    if (!options.skipLoading) {
        const loadingMessage = options.loadingMessage || "Wird geladen...";
        loadingHandlers.startLoading(loadingMessage);
    }

    const token = localStorage.getItem("token");
    const csrfToken = getCSRFToken();

    const config = {
        method: options.method || "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...(csrfToken && { "X-XSRF-TOKEN": csrfToken }),
            ...options.headers,
        },
        credentials: "include",
    };

    // Body separat behandeln
    if (options.body) {
        config.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
    }

    // Restliche Optionen hinzufügen (ohne body zu überschreiben)
    const { body, ...otherOptions } = options;
    Object.assign(config, otherOptions);

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            // Spezielle Behandlung für Server-Fehler (5xx)
            if (response.status >= 500) {
                console.error("Server Error detected", data);
                // Nur weiterleiten wenn nicht im Debug-Modus
                if (!import.meta.env.VITE_DEBUG_SERVER_ERRORS) {
                    console.error("Redirecting to error page");
                    // Kurze Verzögerung, damit der Loading-Overlay beendet wird
                    setTimeout(() => {
                        window.location.href = '/server-error';
                    }, 100);
                }
                throw new Error("Server-Fehler aufgetreten");
            }
            throw new Error(data.message || "API request failed");
        }

        // Beende den globalen Ladevorgang
        if (!options.skipLoading) {
            loadingHandlers.stopLoading();
        }
        return data;
    } catch (error) {
        console.error("API Error:", error);
        // Beende den globalen Ladevorgang auch im Fehlerfall
        if (!options.skipLoading) {
            loadingHandlers.stopLoading();
        }
        throw error;
    }
}

/**
 * CSRF-Cookie initialisieren (vor Login/Register)
 */
async function initCSRF() {
    try {
        // Verwende die gleiche Base-URL wie die API
        const csrfUrl = API_BASE_URL.replace('/api', '/sanctum/csrf-cookie');
        await fetch(csrfUrl, {
            method: "GET",
            credentials: "include",
        });
    } catch (error) {
        console.error("CSRF Init Error:", error);
    }
}

/**
 * Auth API Endpoints
 */
const authAPI = {
    // Register
    register: async (name, email, password, password_confirmation, privacyAccepted) => {
        return apiRequest("/register", {
            method: "POST",
            body: JSON.stringify({
                name,
                email,
                password,
                password_confirmation,
                privacy_accepted: privacyAccepted,
            }),
            loadingMessage: "Registrierung wird verarbeitet...",
        });
    },

    // Login
    login: async (email, password) => {
        await initCSRF();
        return apiRequest("/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
            loadingMessage: "Anmeldung wird verarbeitet...",
        });
    },

    // Logout
    logout: async () => {
        return apiRequest("/logout", {
            method: "POST",
            loadingMessage: "Abmeldung wird verarbeitet...",
        });
    },

    // Get current user
    getUser: async () => {
        return apiRequest("/user", {
            method: "GET",
            loadingMessage: "Benutzerdaten werden geladen...",
        });
    },

    // Check user role
    checkRole: async () => {
        return apiRequest("/user/role", {
            method: "GET",
            loadingMessage: "Benutzerrolle wird überprüft...",
        });
    },

    // E-Mail verifizieren
    verifyEmail: async (token) => {
        return apiRequest("/verify-email", {
            method: "POST",
            body: JSON.stringify({ token }),
            loadingMessage: "E-Mail wird verifiziert...",
        });
    },

    // Verifizierungs-E-Mail erneut senden
    resendVerification: async (email) => {
        await initCSRF();
        return apiRequest("/resend-verification", {
            method: "POST",
            body: JSON.stringify({ email }),
            loadingMessage: "E-Mail wird gesendet...",
        });
    },

    // Passwort-Reset-Link anfordern
    forgotPassword: async (email) => {
        await initCSRF();
        return apiRequest("/forgot-password", {
            method: "POST",
            body: JSON.stringify({ email }),
            loadingMessage: "E-Mail wird gesendet...",
        });
    },

    // Passwort zurücksetzen
    resetPassword: async (email, token, password, password_confirmation) => {
        await initCSRF();
        return apiRequest("/reset-password", {
            method: "POST",
            body: JSON.stringify({
                email,
                token,
                password,
                password_confirmation,
            }),
            loadingMessage: "Passwort wird zurückgesetzt...",
        });
    },
    // Passwort ändern (für eingeloggte User)
    changePassword: async (
        current_password,
        new_password,
        new_password_confirmation
    ) => {
        await initCSRF();
        return apiRequest("/user/change-password", {
            method: "POST",
            body: JSON.stringify({
                current_password,
                new_password,
                new_password_confirmation,
            }),
            loadingMessage: "Passwort wird geändert...",
        });
    },
};

// User API (Public)
export const userAPI = {
    /**
     * Get all users (öffentlich, für Spielerauswahl)
     * GET /api/users
     * Optional: Filter nach Role → ?role=player
     * Cached während aktiven Spiels
     */
    getAll: async (page = 1, role = null, force = false) => {
        const isGameActive = localStorage.getItem('gameActive') === 'true';
        const cacheKey = `users_${page}_${role || 'all'}`;

        if (!force && isGameActive) {
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                return JSON.parse(cached);
            }
        }

        const params = new URLSearchParams({ page });
        if (role) params.append("role", role);

        const data = await apiRequest(`/users?${params.toString()}`, {
            method: "GET",
            loadingMessage: "Benutzerliste wird geladen...",
            credentials: "omit", // Öffentlicher Endpoint, keine Credentials nötig
        });

        // Cache die Daten, wenn Spiel aktiv
        if (isGameActive) {
            localStorage.setItem(cacheKey, JSON.stringify(data));
        }

        return data;
    },
};

// Admin API Endpoints
const adminAPI = {
    // Get all users (admin)
    getUsers: async (page = 1, role = null) => {
        const params = new URLSearchParams({ page });
        if (role) params.append("role", role);

        return apiRequest(`/admin/users?${params.toString()}`, {
            method: "GET",
            loadingMessage: "Benutzerliste wird geladen...",
        });
    },

    // Update user role
    updateUserRole: async (userId, role) => {
        return apiRequest(`/admin/users/${userId}/role`, {
            method: "PATCH",
            body: JSON.stringify({ role }),
            loadingMessage: "Benutzerrolle wird aktualisiert...",
        });
    },

    // Update user name
    updateUserName: async (userId, name) => {
        return apiRequest(`/admin/users/${userId}/name`, {
            method: "PATCH",
            body: JSON.stringify({ name }),
            loadingMessage: "Benutzername wird aktualisiert...",
        });
    },

    // Delete user
    deleteUser: async (userId) => {
        return apiRequest(`/admin/users/${userId}`, {
            method: "DELETE",
            loadingMessage: "Benutzer wird gelöscht...",
        });
    },

    // Send test email
    sendTestEmail: async (email) => {
        return apiRequest("/admin/test-email", {
            method: "POST",
            body: JSON.stringify({ email }),
            loadingMessage: "Sende Test-E-Mail...",
        });
    },

    // Admin Settings
    getSettings: async () => {
        return apiRequest("/admin/settings", {
            method: "GET",
            loadingMessage: "Einstellungen werden geladen...",
        });
    },

    updateSetting: async (key, settingData) => {
        return apiRequest(`/admin/settings/${key}`, {
            method: "PUT",
            body: JSON.stringify(settingData),
            loadingMessage: "Einstellung wird aktualisiert...",
        });
    },

    deleteSetting: async (key) => {
        return apiRequest(`/admin/settings/${key}`, {
            method: "DELETE",
            loadingMessage: "Einstellung wird gelöscht...",
        });
    },
};
const publicAPI = {
    // Get app version
    getVersion: async () => {
        return apiRequest("/version", {
            loadingMessage: "Version wird geladen...",
        });
    },

    // ⭐ Public Settings
    getCountUpDuration: async () => {
        return apiRequest("/settings/count_up_duration", {
            method: "GET",
        });
    },
};

// Game API Endpoints
const gameAPI = {
    // Create new game (Admin only)
    createGame: async (gameData) => {
        return apiRequest("/games", {
            method: "POST",
            body: gameData,
            skipLoading: true,
        });
    },

    // Check if admin has active game
    hasActiveGame: async () => {
        return apiRequest("/games/active", {
            method: "GET",
            loadingMessage: "Spiel-Status wird überprüft...",
        });
    },

    // Get all user games (Host only)
    getUserGames: async () => {
        return apiRequest("/games/user-games", {
            method: "GET",
            loadingMessage: "Spiele werden geladen...",
        });
    },

    // Get game data (for live view)
    getGame: async (gameId) => {
        return apiRequest(`/games/${gameId}`, {
            loadingMessage: "Spiel-Daten werden geladen...",
        });
    },

    // Update game (Admin only)
    updateGame: async (gameId, gameData) => {
        return apiRequest(`/games/${gameId}`, {
            method: "PATCH",
            body: { game_data: gameData },
            loadingMessage: "Spiel wird gespeichert...",
        });
    },

    // Pause game (set status to paused)
    pauseGame: async (gameId) => {
        return apiRequest(`/games/${gameId}/pause`, {
            method: "PATCH",
            loadingMessage: "Spiel wird pausiert...",
        });
    },

    // Resume game (set status to active)
    resumeGame: async (gameId) => {
        return apiRequest(`/games/${gameId}/resume`, {
            method: "PATCH",
            skipLoading: true,
        });
    },

    // Finish game (set status to finished)
    finishGame: async (gameId) => {
        return apiRequest(`/games/${gameId}/finish`, {
            method: "PATCH",
            loadingMessage: "Spiel wird beendet...",
        });
    },

    // Delete game (Admin only)
    deleteGame: async (gameId) => {
        return apiRequest(`/games/${gameId}`, {
            method: "DELETE",
            skipLoading: true,
        });
    },
};

// Stats API Endpoints
const statsAPI = {
    // Get all players stats
    getPlayersStats: async () => {
        return apiRequest("/stats/players", {
            loadingMessage: "Statistiken werden geladen...",
        });
    },

    // Get single player stats
    getPlayerStats: async (playerId) => {
        return apiRequest(`/stats/player/${playerId}`, {
            loadingMessage: "Spieler-Statistiken werden geladen...",
        });
    },

    // Admin Stats
    getAdminStats: async () => {
        return apiRequest("/admin/stats", {
            loadingMessage: "Admin-Statistiken werden geladen...",
        });
    },
};

// Ranking API Endpoints
const rankingAPI = {
    // Get top rankings
    getRankings: async (limit = 50, offset = 0) => {
        const params = new URLSearchParams({ limit, offset });
        return apiRequest(`/rankings?${params.toString()}`, {
            loadingMessage: "Rankings werden geladen...",
        });
    },

    // Get ranking overview stats
    getRankingStats: async () => {
        return apiRequest("/rankings/stats", {
            loadingMessage: "Ranking-Statistiken werden geladen...",
        });
    },

    // Get detailed ranking for a specific user
    getUserRanking: async (userId) => {
        return apiRequest(`/rankings/${userId}`, {
            loadingMessage: "Spieler-Details werden geladen...",
        });
    },
};

export { authAPI, gameAPI, statsAPI, rankingAPI, adminAPI, publicAPI };
export default apiRequest;
