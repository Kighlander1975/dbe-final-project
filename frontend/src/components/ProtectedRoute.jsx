// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "60vh",
                    fontSize: "1.5rem",
                }}
            >
                ⏳ Laden...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

// ⭐ Neue Route-Komponente: Verhindert Zugriff auf /new-game bei aktivem Spiel
export function NoActiveGameRoute({ children }) {
    const { user, loading, isAdmin } = useAuth();

    // Lade-State
    const [checkingGame, setCheckingGame] = React.useState(true);
    const [activeGame, setActiveGame] = React.useState(null);

    React.useEffect(() => {
        const checkActiveGame = async () => {
            if (user && isAdmin()) {
                try {
                    // Verwende die globale refreshActiveGame Funktion falls verfügbar
                    if (window.refreshActiveGame) {
                        await window.refreshActiveGame();
                        // Warte kurz, bis der State aktualisiert ist
                        setTimeout(() => {
                            // Hier könnten wir den State aus MainLayout lesen, aber das ist tricky
                            // Stattdessen machen wir einen direkten API-Call
                            setCheckingGame(false);
                        }, 100);
                    } else {
                        setCheckingGame(false);
                    }
                } catch (error) {
                    console.error('Failed to check active game:', error);
                    setCheckingGame(false);
                }
            } else {
                setCheckingGame(false);
            }
        };

        if (!loading && user) {
            checkActiveGame();
        }
    }, [user, loading, isAdmin]);

    if (loading || checkingGame) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "60vh",
                    fontSize: "1.5rem",
                }}
            >
                ⏳ Laden...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // ⭐ Wenn Admin und aktives Spiel läuft, weiterleiten zum Spiel
    if (isAdmin() && window.activeGame) {
        return <Navigate to={`/game/${window.activeGame.id}`} replace />;
    }

    return children;
}

export default ProtectedRoute;