// src/layouts/MainLayout.jsx
import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import LoadingOverlay from "../components/LoadingOverlay";
import "../styles/layout.css";
import "../components/OrientationGuard.css"; // Für die Sperre-Styles

function MainLayout() {
    const { user, logout, loading, isAdmin } = useAuth(); // ⭐ isAdmin hinzugefügt
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    // Orientation-Check
    const [deviceStatus, setDeviceStatus] = useState({ isAllowed: true, reason: null });

    useEffect(() => {
        const checkDeviceAndOrientation = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const isLandscape = width > height;
            const isHomePage = location.pathname === '/';

            // Geräte-Erkennung
            if (width < 768) {
                // Telefon - immer blocken (außer vielleicht Home, aber vorerst alles)
                setDeviceStatus({
                    isAllowed: false,
                    reason: 'phone'
                });
            } else if (!isLandscape && !isHomePage) {
                // Tablet im Portrait, aber nicht Home-Seite - blocken
                setDeviceStatus({
                    isAllowed: false,
                    reason: 'portrait'
                });
            } else {
                // Erlaubt: Landscape oder Home-Seite
                setDeviceStatus({
                    isAllowed: true,
                    reason: null
                });
            }
        };

        // Initial prüfen
        checkDeviceAndOrientation();

        // Event Listener für Resize und Orientation Change
        window.addEventListener('resize', checkDeviceAndOrientation);
        window.addEventListener('orientationchange', checkDeviceAndOrientation);

        return () => {
            window.removeEventListener('resize', checkDeviceAndOrientation);
            window.removeEventListener('orientationchange', checkDeviceAndOrientation);
        };
    }, [location.pathname]);

    const handleLogout = async () => {
        await logout();
        showToast("👋 Erfolgreich abgemeldet!", "success", 6000);
        navigate("/login");
    };

    return (
        <div className="main-layout">
            {/* Globaler Loading-Overlay */}
            <LoadingOverlay />

            <header className="main-layout__header">
                <nav className="main-layout__nav">
                    <Link to="/" className="main-layout__logo">
                        🎯 Stechen Helper
                    </Link>

                    {!loading && (
                        <ul className="main-layout__menu">
                            <li>
                                <Link to="/">🏠 Home</Link>
                            </li>

                            {user ? (
                                <>
                                    <li>
                                        <Link to="/new-game">
                                            🎮 Neues Spiel
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to="/change-password">
                                            🔐 Passwort ändern
                                        </Link>
                                    </li>

                                    {/* ⭐ NEU: Admin-Link nur für Admins */}
                                    {isAdmin() && (
                                        <li>
                                            <Link to="/admin">⚙️ Admin</Link>
                                        </li>
                                    )}

                                    <li>
                                        <span
                                            style={{
                                                color: "rgba(255,255,255,0.9)",
                                                padding: "0.5rem 1rem",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.5rem",
                                            }}
                                        >
                                            {/* ⭐ NEU: Role-Badge */}
                                            {isAdmin() && (
                                                <span
                                                    style={{
                                                        background: "#fbbf24",
                                                        color: "#000",
                                                        padding:
                                                            "0.2rem 0.5rem",
                                                        borderRadius: "4px",
                                                        fontSize: "0.75rem",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    ADMIN
                                                </span>
                                            )}
                                            👤 {user.name}
                                        </span>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            style={{
                                                background:
                                                    "rgba(255,255,255,0.2)",
                                                border: "none",
                                                padding: "0.5rem 1rem",
                                                borderRadius:
                                                    "var(--radius-md)",
                                                color: "white",
                                                cursor: "pointer",
                                                fontSize: "0.9rem",
                                                transition: "background 0.2s",
                                            }}
                                            onMouseEnter={(e) =>
                                                (e.target.style.background =
                                                    "rgba(255,255,255,0.3)")
                                            }
                                            onMouseLeave={(e) =>
                                                (e.target.style.background =
                                                    "rgba(255,255,255,0.2)")
                                            }
                                        >
                                            🚪 Logout
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link to="/login">🔐 Login</Link>
                                    </li>
                                    <li>
                                        <Link to="/register">
                                            📝 Registrieren
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    )}

                    {loading && (
                        <div
                            style={{
                                display: "flex",
                                gap: "1rem",
                                alignItems: "center",
                                padding: "0.5rem 1rem",
                            }}
                        >
                            <div
                                style={{
                                    width: "60px",
                                    height: "20px",
                                    background: "rgba(255,255,255,0.2)",
                                    borderRadius: "4px",
                                    animation:
                                        "pulse 1.5s ease-in-out infinite",
                                }}
                            />
                            <div
                                style={{
                                    width: "80px",
                                    height: "20px",
                                    background: "rgba(255,255,255,0.2)",
                                    borderRadius: "4px",
                                    animation:
                                        "pulse 1.5s ease-in-out infinite",
                                }}
                            />
                        </div>
                    )}
                </nav>
            </header>

            <main className="main-layout__main">
                {deviceStatus.isAllowed ? (
                    <Outlet />
                ) : (
                    <div className="orientation-guard">
                        <div className="orientation-guard__content">
                            {deviceStatus.reason === 'phone' ? (
                                <>
                                    <div className="orientation-guard__icon">
                                        📱
                                    </div>
                                    <h1 className="orientation-guard__title">
                                        Telefon nicht unterstützt
                                    </h1>
                                    <p className="orientation-guard__message">
                                        Diese App ist derzeit nur für Tablets und Desktop-Computer optimiert.
                                        <br />
                                        Bitte verwenden Sie ein Tablet oder einen Computer für die beste Erfahrung.
                                    </p>
                                    <div className="orientation-guard__hint">
                                        💡 Die Startseite ist auf Telefonen verfügbar, aber Spiel-Funktionen sind deaktiviert
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="orientation-guard__icon">
                                        📱
                                    </div>
                                    <h1 className="orientation-guard__title">
                                        Bitte drehen Sie Ihr Gerät
                                    </h1>
                                    <p className="orientation-guard__message">
                                        Diese Seite ist nur im Landscape-Modus verfügbar.
                                        <br />
                                        Bitte drehen Sie Ihr Tablet oder verwenden Sie die Home-Seite.
                                    </p>
                                    <div className="orientation-guard__hint">
                                        💡 Gehen Sie zur <Link to="/" style={{color: 'white', textDecoration: 'underline'}}>Home-Seite</Link> für Portrait-Modus
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </main>

            <footer className="main-layout__footer">
                <p>© 2025 Stechen Helper - Alle Rechte vorbehalten</p>
            </footer>

            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
        </div>
    );
}

export default MainLayout;
