// src/services/api.js

const API_BASE_URL = "http://localhost:8000/api";

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
    const token = localStorage.getItem("auth_token");
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

    // ⭐ DEBUG: Request-Details
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

        // ⭐ DEBUG: Response-Details
        console.log("📥 API Response:", {
            status: response.status,
            ok: response.ok,
            data: data,
        });

        if (!response.ok) {
            throw new Error(data.message || "API request failed");
        }

        return data;
    } catch (error) {
        console.error("API Error:", error);
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
        });
    },

    // Login
    login: async (email, password) => {
        await initCSRF();
        return apiRequest("/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
    },

    // Logout
    logout: async () => {
        return apiRequest("/logout", {
            method: "POST",
        });
    },

    // Get current user
    getUser: async () => {
        return apiRequest("/user", {
            method: "GET",
        });
    },

    // ⭐ NEU: E-Mail verifizieren
    verifyEmail: async (token) => {
        return apiRequest("/verify-email", {
            method: "POST",
            body: JSON.stringify({ token }),
        });
    },

    // ⭐ NEU: Verifizierungs-E-Mail erneut senden
    resendVerification: async (email) => {
        await initCSRF();
        return apiRequest("/resend-verification", {
            method: "POST",
            body: JSON.stringify({ email }),
        });
    },
};

export default apiRequest;
