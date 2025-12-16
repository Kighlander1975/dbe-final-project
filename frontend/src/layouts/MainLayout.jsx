// src/layouts/MainLayout.jsx
import React, { useState, useEffect, useRef } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useUnsavedChanges } from "../context/UnsavedChangesContext"; // 🆕 UnsavedChangesContext
import LoadingOverlay from "../components/LoadingOverlay";
import "../styles/layout.css";
import "../components/OrientationGuard.css"; // Für die Sperre-Styles
import { gameAPI, publicAPI, parseGameName } from "../services/api"; // ⭐ Game API und Public API import

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

    // Modal States
    const [showImprintModal, setShowImprintModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

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
                                                        const { gameName, formattedDate } = parseGameName(activeGame.gameName);
                                                        return `${gameName} (${formattedDate})`;
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
                <div className="footer-content">
                    <p>© 2025 Stechen Helper - Alle Rechte vorbehalten</p>
                    <div className="footer-links">
                        <button 
                            onClick={() => setShowImprintModal(true)}
                            className="footer-link"
                        >
                            Impressum
                        </button>
                        <span className="footer-separator">|</span>
                        <button 
                            onClick={() => setShowPrivacyModal(true)}
                            className="footer-link"
                        >
                            Datenschutzerklärung
                        </button>
                    </div>
                </div>
            </footer>

            {/* Impressum Modal */}
            {showImprintModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Impressum</h2>
                        </div>
                        <div className="modal-body modal-body-scroll">
                            <h3>Angaben gemäß § 5 TMG</h3>
                            <p>
                                <b>Kai Akkermann</b><br />
                                Rennerskamp 16 B<br />
                                32289 Rödinghausen<br />
                                Deutschland
                            </p>
                            <h3>Kontakt</h3>
                            <p>
                                Telefon: +49 (0)151 6524 5116<br />
                                E-Mail: kai.akkermann@kighlander.de<br />
                                Web: https://kighlander.de
                            </p>
                            <h3>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
                            <p>
                                Kai Akkermann<br />
                                (Anschrift wie oben)
                            </p>
                            <h3>Non-Profit-Hinweis</h3>
                            <p>
                                Dieses Webangebot ist ein privates, nicht-kommerzielles Non-Profit-Projekt. Es erfolgt keine Gewinnerzielungsabsicht und keine kommerzielle Nutzung der bereitgestellten Inhalte.
                            </p>
                            <h3>Haftungsausschluss</h3>
                            <p>
                                Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden. Es bestehen keine externen Links.
                            </p>
                            <h3>Streitschlichtung</h3>
                            <p>
                                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit. Als privater, nicht-kommerzieller Betreiber bin ich nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button 
                                onClick={() => setShowImprintModal(false)}
                                className="btn btn-primary"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Datenschutzerklärung Modal */}
            {showPrivacyModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Datenschutzerklärung</h2>
                        </div>
                        <div className="modal-body modal-body-scroll">
                            <h3>1. Verantwortlicher</h3>
                            <p>
                                Verantwortlich für die Datenverarbeitung ist der im <b>Impressum</b> genannte Betreiber dieser Anwendung.
                                <br />
                                Siehe <button className="footer-link footer-link-inline" onClick={() => { setShowPrivacyModal(false); setShowImprintModal(true); }}>Impressum</button>.
                            </p>
                            <h3>2. Zwecke und Rechtsgrundlagen der Datenverarbeitung</h3>
                            <ul>
                                <li>Bereitstellung und Betrieb der App (Art. 6 Abs. 1 lit. b DSGVO)</li>
                                <li>Authentifizierung und Verwaltung von Nutzerkonten (Art. 6 Abs. 1 lit. b DSGVO)</li>
                                <li>Führen von Ranglisten und Spielstatistiken (Art. 6 Abs. 1 lit. f DSGVO, berechtigtes Interesse)</li>
                                <li>Erfüllung gesetzlicher Aufbewahrungspflichten (Art. 6 Abs. 1 lit. c DSGVO)</li>
                            </ul>
                            <h3>3. Erhobene Daten</h3>
                            <ul>
                                <li><b>E-Mail-Adresse</b> (bei Registrierung): Authentifizierung, Accountverwaltung, Wiederherstellung</li>
                                <li><b>Name/Alias</b>: Anzeige im Spiel, Ranglisten</li>
                                <li><b>Passwort</b>: Nur gehasht gespeichert</li>
                                <li><b>Spielverläufe & Statistiken</b>: Zuordnung zu User-ID, für 2 Jahre gespeichert</li>
                                <li><b>Geräte-/Nutzungsdaten</b>: Nur technisch notwendige Daten (z.B. Session, Cookies)</li>
                            </ul>
                            <h3>4. Speicherdauer und Löschung</h3>
                            <ul>
                                <li>Accountdaten: Bis zur Löschung des Accounts, danach E-Mail & User-ID für 2 Jahre (Ranglisten-Konsistenz, Wiederherstellung)</li>
                                <li>Spielverläufe: 2 Jahre ab Spielende, dann automatische Löschung</li>
                                <li>Ranglisten: Dauerhaft, aber nach Account-Löschung anonymisiert („Anonymer Nutzer“)</li>
                                <li>Backups: Maximal 30 Tage</li>
                            </ul>
                            <h3>5. Betroffenenrechte</h3>
                            <ul>
                                <li>Auskunft über gespeicherte Daten (Art. 15 DSGVO)</li>
                                <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
                                <li>Löschung („Recht auf Vergessenwerden“, Art. 17 DSGVO)</li>
                                <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                                <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                                <li>Widerspruch gegen Verarbeitung (Art. 21 DSGVO)</li>
                                <li>Beschwerderecht bei einer Aufsichtsbehörde</li>
                            </ul>
                            <h3>6. Weitergabe von Daten</h3>
                            <p>
                                Es erfolgt keine Weitergabe Ihrer Daten an Dritte, außer es besteht eine gesetzliche Pflicht oder Sie haben ausdrücklich eingewilligt.
                            </p>
                            <h3>7. Technische und organisatorische Maßnahmen</h3>
                            <ul>
                                <li>Passwort-Hashing (bcrypt)</li>
                                <li>Soft-Delete mit 30-Tage-Frist</li>
                                <li>Automatische Löschung von Spielverläufen</li>
                                <li>Zugriffsbeschränkungen für Admins</li>
                                <li>Regelmäßige Backups (max. 30 Tage)</li>
                                <li>CSRF-Schutz, Authentifizierung via Sanctum</li>
                                <li>Logging und Monitoring von Löschvorgängen</li>
                            </ul>
                            <h3>8. Kontakt</h3>
                            <p>
                                Für Fragen zum Datenschutz wenden Sie sich bitte an den im <b>Impressum</b> genannten Kontakt.
                            </p>
                            <p className="modal-note">
                                Stand: 15.12.2025 – Diese Datenschutzerklärung wird regelmäßig aktualisiert.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button 
                                onClick={() => setShowPrivacyModal(false)}
                                className="btn btn-primary"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MainLayout;
