// src/components/OrientationGuard.jsx
import React, { useState, useEffect } from 'react';
import './OrientationGuard.css';

function OrientationGuard({ children }) {
    const [deviceStatus, setDeviceStatus] = useState({ isAllowed: true, reason: null });

    useEffect(() => {
        const checkDeviceAndOrientation = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const isLandscape = width > height;

            // Geräte-Erkennung
            if (width < 768) {
                // Telefon - blocken
                setDeviceStatus({
                    isAllowed: false,
                    reason: 'phone'
                });
            } else if (!isLandscape) {
                // Tablet/Desktop im Portrait - blocken
                setDeviceStatus({
                    isAllowed: false,
                    reason: 'portrait'
                });
            } else {
                // Erlaubt: Tablet/Desktop im Landscape
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
    }, []);

    if (deviceStatus.isAllowed) {
        return children;
    }

    // Unterschiedliche Hinweise je nach Grund
    if (deviceStatus.reason === 'phone') {
        return (
            <div className="orientation-guard">
                <div className="orientation-guard__content">
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
                </div>
            </div>
        );
    }

    // Portrait-Modus (reason === 'portrait')
    return (
        <div className="orientation-guard">
            <div className="orientation-guard__content">
                <div className="orientation-guard__icon">
                    📱
                </div>
                <h1 className="orientation-guard__title">
                    Bitte drehen Sie Ihr Gerät
                </h1>
                <p className="orientation-guard__message">
                    Diese App ist für die Verwendung im Landscape-Modus optimiert.
                    <br />
                    Bitte drehen Sie Ihr Tablet für die beste Erfahrung.
                </p>
                <div className="orientation-guard__hint">
                    💡 Verwenden Sie Landscape für optimale Spielerfahrung
                </div>
            </div>
        </div>
    );
}

export default OrientationGuard;