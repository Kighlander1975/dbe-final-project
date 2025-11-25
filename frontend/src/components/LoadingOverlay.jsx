// src/components/LoadingOverlay.jsx
import React, { useState, useEffect } from "react";
import { useLoading } from "../context/LoadingContext";
import "../styles/components/loading.css";

function LoadingOverlay() {
    const { isLoading, loadingMessage } = useLoading();
    const [showOverlay, setShowOverlay] = useState(false);

    // TODO: Später im Admin-Dashboard konfigurierbar machen
    // Aktuell: Fester Wert von 150ms
    // Zweck: Verhindert Flackern bei schnellen Requests (<150ms)
    const LOADING_DELAY_MS = 150;

    useEffect(() => {
        let timer;

        if (isLoading) {
            // Overlay erscheint erst nach 150ms
            timer = setTimeout(() => {
                setShowOverlay(true);
            }, LOADING_DELAY_MS);
        } else {
            // Sofort ausblenden, wenn Loading fertig
            setShowOverlay(false);
        }

        // Cleanup: Timer abbrechen, wenn Komponente unmountet oder isLoading sich ändert
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [isLoading]);

    if (!showOverlay) return null;

    return (
        <div className="loading-overlay">
            <div className="loading-overlay__content">
                <div className="loading-overlay__spinner"></div>
                <p className="loading-overlay__message">{loadingMessage}</p>
            </div>
        </div>
    );
}

export default LoadingOverlay;
