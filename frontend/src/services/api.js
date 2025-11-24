// src/services/api.js

const API_BASE_URL = "http://localhost:8000/api";

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
    // Starte den globalen Ladevorgang
    const loadingMessage = options.loadingMessage || "Wird geladen...";
    loadingHandlers.startLoading(loadingMessage);

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
        ...options,
    };

    console.log("📤 API Request:", {
        url: `${API_BASE_URL}${endpoint}`,
        method: config.method,
        body: options.body,
        headers: config.headers,
        csrfToken: csrfToken,
    });

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        console.log("📥 API Response:", {
            status: response.status,
            ok: response.ok,
            data: data,
        });

        if (!response.ok) {
            throw new Error(data.message || "API request failed");
        }

        // Beende den globalen Ladevorgang
        loadingHandlers.stopLoading();
        return data;
    } catch (error) {
        console.error("API Error:", error);
        // Beende den globalen Ladevorgang auch im Fehlerfall
        loadingHandlers.stopLoading();
        throw error;
    }
}

/**
 * CSRF-Cookie initialisieren (vor Login/Register)
 */
async function initCSRF() {
    try {
        await fetch("http://localhost:8000/sanctum/csrf-cookie", {
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
export const authAPI = {
    // Register
    register: async (name, email, password, password_confirmation) => {
        await initCSRF();
        return apiRequest("/register", {
            method: "POST",
            body: JSON.stringify({
                name,
                email,
                password,
                password_confirmation,
            }),
            loadingMessage: "Registrierung wird verarbeitet..."
        });
    },

    // Login
    login: async (email, password) => {
        await initCSRF();
        return apiRequest("/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
            loadingMessage: "Anmeldung wird verarbeitet..."
        });
    },

    // Logout
    logout: async () => {
        return apiRequest("/logout", {
            method: "POST",
            loadingMessage: "Abmeldung wird verarbeitet..."
        });
    },

    // Get current user
    getUser: async () => {
        return apiRequest("/user", {
            method: "GET",
            loadingMessage: "Benutzerdaten werden geladen..."
        });
    },

    // ⭐ NEU: Check user role
    checkRole: async () => {
        return apiRequest("/user/role", {
            method: "GET",
            loadingMessage: "Benutzerrolle wird überprüft..."
        });
    },

    // E-Mail verifizieren
    verifyEmail: async (token) => {
        return apiRequest("/verify-email", {
            method: "POST",
            body: JSON.stringify({ token }),
            loadingMessage: "E-Mail wird verifiziert..."
        });
    },

    // Verifizierungs-E-Mail erneut senden
    resendVerification: async (email) => {
        await initCSRF();
        return apiRequest("/resend-verification", {
            method: "POST",
            body: JSON.stringify({ email }),
            loadingMessage: "E-Mail wird gesendet..."
        });
    },
};

// ⭐ NEU: Admin API Endpoints
export const adminAPI = {
    // Get all users
    getUsers: async (page = 1, role = null) => {
        const params = new URLSearchParams({ page });
        if (role) params.append('role', role);
        
        return apiRequest(`/admin/users?${params.toString()}`, {
            method: "GET",
            loadingMessage: "Benutzerliste wird geladen..."
        });
    },

    // Update user role
    updateUserRole: async (userId, role) => {
        return apiRequest(`/admin/users/${userId}/role`, {
            method: "PATCH",
            body: JSON.stringify({ role }),
            loadingMessage: "Benutzerrolle wird aktualisiert..."
        });
    },

    // Ban user
    banUser: async (userId) => {
        return apiRequest(`/admin/users/${userId}/ban`, {
            method: "PATCH",
            loadingMessage: "Benutzer wird gesperrt..."
        });
    },

    // Unban user
    unbanUser: async (userId) => {
        return apiRequest(`/admin/users/${userId}/unban`, {
            method: "PATCH",
            loadingMessage: "Benutzer wird entsperrt..."
        });
    },
};

export default apiRequest;