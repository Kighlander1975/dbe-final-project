// src/layouts/MainLayout.jsx
import React, { useState, useEffect, useRef } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useUnsavedChanges } from "../context/UnsavedChangesContext"; // 🆕 UnsavedChangesContext
import LoadingOverlay from "../components/LoadingOverlay";
import "../styles/layout.css";
import "../components/OrientationGuard.css"; // Für die Sperre-Styles
import { gameAPI, publicAPI } from "../services/api"; // ⭐ Game API und Public API import

function MainLayout() {
    const { user, logout, loading, isAdmin, isGameCreator } = useAuth(); // ⭐ isAdmin und isGameCreator hinzugefügt
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const { hasUnsavedChanges, setHasUnsavedChanges } = useUnsavedChanges(); // 🆕 UnsavedChangesContext

    // Build Hash State
    const [buildHash, setBuildHash] = useState('');

    // ⭐ App Version State
    const [appVersion, setAppVersion] = useState('1.0');

    // ⭐ Debug Mode State
    const [debugMode, setDebugMode] = useState(false);

    // Hamburger Menu State
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // ⭐ Active Game State
    const [activeGame, setActiveGame] = useState(null);

    // Orientation-Check
    const [deviceStatus, setDeviceStatus] = useState({ isAllowed: true, reason: null });

    // ⭐ Function to refresh active game status
    const refreshActiveGame = async () => {
        if (user) { // Für alle authentifizierten User, nicht nur Admins
            try {
                const response = await gameAPI.hasActiveGame();
                setActiveGame(response.hasActiveGame ? response.activeGame : null);
            } catch (error) {
                console.error('Failed to refresh active game:', error);
                setActiveGame(null);
            }
        } else {
            setActiveGame(null);
        }
    };

    // ⭐ Expose refreshActiveGame globally for other components
    useEffect(() => {
        window.refreshActiveGame = refreshActiveGame;
        return () => {
            delete window.refreshActiveGame;
        };
    }, [user, isAdmin]);

    // ⭐ Expose loadAppVersion globally for other components
    useEffect(() => {
        window.refreshAppVersion = loadAppVersion;
        return () => {
            delete window.refreshAppVersion;
        };
    }, []);

    // ⭐ Expose loadDebugMode globally for other components
    useEffect(() => {
        window.refreshDebugMode = loadDebugMode;
        return () => {
            delete window.refreshDebugMode;
        };
    }, []);

    // ⭐ Function to load app version
    const loadAppVersion = async () => {
        try {
            const response = await publicAPI.getVersion();
            setAppVersion(response.version);
        } catch (error) {
            console.error('Failed to load app version:', error);
            // Fallback to default version
            setAppVersion('1.0');
        }
    };

    // ⭐ Function to load debug mode
    const loadDebugMode = async () => {
        try {
            // Load debug setting from admin settings API (public access needed)
            const response = await fetch('/api/admin/settings/debug_server_error', {
                headers: {
                    'Accept': 'application/json',
                }
            });
            if (response.ok) {
                const data = await response.json();
                setDebugMode(data.setting?.value === 'true');
            }
        } catch (error) {
            console.error('Failed to load debug mode:', error);
            // Fallback to env value
            setDebugMode(import.meta.env.VITE_DEBUG_SERVER_ERRORS === 'true');
        }
    };

    // ⭐ Load app version and debug mode on mount
    useEffect(() => {
        loadAppVersion();
        loadDebugMode();
    }, []);

    // ⭐ Refresh active game when location changes (navigation)
    useEffect(() => {
        refreshActiveGame();
    }, [location.pathname]);

    // ⭐ Close hamburger menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen]);

    // Extract build hash from script tag
    useEffect(() => {
        const scripts = document.querySelectorAll('script[src]');
        for (const script of scripts) {
            const src = script.getAttribute('src');
            if (src && src.includes('index-') && src.includes('.js')) {
                const match = src.match(/index-([a-zA-Z0-9_-]+)\.js/);
                if (match && match[1]) {
                    setBuildHash(match[1]);
                    break;
                }
            }
        }
    }, []);

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
        navigate("/");
    };

    // 🆕 Navigation mit Blocker-Check
    const handleNavigate = (to) => {
        if (hasUnsavedChanges) {
            const confirmLeave = window.confirm(
                'Du hast ungespeicherte Änderungen. Möchtest du wirklich die Seite verlassen? Alle Daten gehen verloren.'
            );
            if (confirmLeave) {
                setHasUnsavedChanges(false); // Schutz deaktivieren
                navigate(to);
            }
        } else {
            navigate(to);
        }
    };

    return (
        <div className="main-layout">
            {/* Globaler Loading-Overlay */}
            <LoadingOverlay />

            <header className="main-layout__header">
                <nav className="main-layout__nav">
                    <div className="main-layout__logo-container">
                        <button onClick={() => handleNavigate('/')} className="main-layout__logo">
                            🎯 Stechen Helper
                        </button>
                        {buildHash && (
                            <div className="main-layout__build-hash">
                                Version: {appVersion} (Build: {buildHash}){debugMode && ' DEBUG ACTIVE'}
                            </div>
                        )}
                    </div>

                    <div className="main-layout__right">
                        {user && (
                            <div className="main-layout__user-info">
                                {/* ⭐ Role-Badge */}
                                {isAdmin() && (
                                    <span className="main-layout__role-badge">
                                        ADMIN
                                    </span>
                                )}
                                <span className="main-layout__user-name">
                                    👤 {user.name}
                                </span>
                            </div>
                        )}

                        <button 
                            className="main-layout__hamburger" 
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Menü öffnen"
                        >
                            ☰
                        </button>
                    </div>

                    {/* Hamburger Menu */}
                    {menuOpen && (
                        <div className="main-layout__hamburger-menu" ref={menuRef}>
                            <button onClick={() => { handleNavigate('/'); setMenuOpen(false); }} className="main-layout__menu-item">
                                🏠 Home
                            </button>

                            {user ? (
                                <>
                                    {/* ⭐ Spiel-Optionen nur für GameCreator (Admin/Host) */}
                                    {isGameCreator() && (
                                        <>
                                            {activeGame ? (
                                                <button 
                                                    onClick={() => { handleNavigate(`/game/${activeGame.id}`); setMenuOpen(false); }} 
                                                    className={`main-layout__menu-item ${location.pathname === `/game/${activeGame.id}` ? 'main-layout__menu-item--active' : ''}`}
                                                    disabled={location.pathname === `/game/${activeGame.id}`}
                                                >
                                                    🎯 Zum aktiven Spiel: {(() => {
                                                        const parts = activeGame.gameName.split('_');
                                                        const title = parts[0];
                                                        if (parts.length >= 2) {
                                                            let timestamp = parseInt(parts[1]);
                                                            if (timestamp < 1577836800000) {
                                                                timestamp *= 1000;
                                                            }
                                                            const date = new Date(timestamp);
                                                            const dateStr = date.toLocaleDateString('de-DE');
                                                            return `${title} (${dateStr})`;
                                                        }
                                                        return title;
                                                    })()}
                                                </button>
                                            ) : (
                                                <button onClick={() => { handleNavigate('/new-game'); setMenuOpen(false); }} className="main-layout__menu-item">
                                                    🎮 Neues Spiel
                                                </button>
                                            )}
                                        </>
                                    )}

                                    <button onClick={() => { handleNavigate('/change-password'); setMenuOpen(false); }} className="main-layout__menu-item">
                                        🔐 Passwort ändern
                                    </button>

                                    <button onClick={() => { handleNavigate('/rankings'); setMenuOpen(false); }} className="main-layout__menu-item">
                                        🏆 Rankings
                                    </button>

                                    {/* ⭐ Admin-Link nur für Admins */}
                                    {isAdmin() && (
                                        <button onClick={() => { handleNavigate('/admin'); setMenuOpen(false); }} className="main-layout__menu-item">
                                            ⚙️ Admin
                                        </button>
                                    )}

                                    <button onClick={handleLogout} className="main-layout__menu-item main-layout__logout">
                                        🚪 Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setMenuOpen(false)} className="main-layout__menu-item">
                                        🔐 Login
                                    </Link>
                                    <Link to="/register" onClick={() => setMenuOpen(false)} className="main-layout__menu-item">
                                        📝 Registrieren
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                </nav>
            </header>

            <main className={`main-layout__main ${location.pathname === '/game' ? 'main-layout__main--game' : ''}`}>
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
