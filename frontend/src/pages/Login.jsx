// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useLoading } from "../context/LoadingContext";
import "../styles/pages/forms.css";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { showToast } = useToast();
    const { startLoading, stopLoading } = useLoading();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Lokaler State für Button-Disable

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        
        startLoading("Anmeldung läuft...");

        if (!formData.email || !formData.password) {
            setError("Bitte fülle alle Felder aus");
            setLoading(false);
            stopLoading();
            return;
        }

        try {
            // Login
            const result = await login(formData.email, formData.password);

            if (result.success) {
                // Setze das Flag, dass der Benutzer gerade eingeloggt wurde
                sessionStorage.setItem("justLoggedIn", "true");

                showToast("Erfolgreich angemeldet!", "success", 6000);

                // Warte kurz, damit AuthContext den State setzen kann
                setTimeout(() => {
                    navigate("/");
                }, 100);
            } else {
                setError(result.message);
                stopLoading();
            }
        } catch (err) {
            setError("Ein Fehler ist aufgetreten");
            stopLoading();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login">
            <div className="login__container">
                <h1 className="login__title">Login</h1>
                <p className="login__subtitle">Melde dich an</p>

                {error && (
                    <div
                        style={{
                            padding: "1rem",
                            marginBottom: "1rem",
                            backgroundColor: "#fee",
                            color: "#c33",
                            borderRadius: "var(--radius-md)",
                            textAlign: "center",
                        }}
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">E-Mail</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="deine@email.de"
                            disabled={loading}
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
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? "Anmelden..." : "Anmelden"}
                        </button>
                    </div>
                    <div className="form-link" style={{ marginTop: "1rem" }}>
                        <Link to="/forgot-password">Passwort vergessen?</Link>
                    </div>
                </form>

                <div className="form-link">
                    Noch kein Account?{" "}
                    <Link to="/register">Jetzt registrieren</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
