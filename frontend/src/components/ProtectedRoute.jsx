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
    const { user, loading, isGameCreator } = useAuth();

    // Lade-State
    const [checkingGame, setCheckingGame] = React.useState(true);
    const [activeGame, setActiveGame] = React.useState(null);

    React.useEffect(() => {
        const checkActiveGame = async () => {
            if (user && isGameCreator()) {
                try {
                    const response = await gameAPI.hasActiveGame();
                    if (response.hasActiveGame) {
                        setActiveGame(response.activeGame);
                    }
                } catch (error) {
                    console.error('Failed to check active game:', error);
                }
            }
            setCheckingGame(false);
        };

        if (!loading && user) {
            checkActiveGame();
        } else if (!loading && !user) {
            setCheckingGame(false);
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

    // ⭐ Wenn GameCreator (Admin/Host) und aktives Spiel läuft, weiterleiten zum Spiel
    if (isGameCreator() && activeGame) {
        return <Navigate to={`/game/${activeGame.id}`} replace />;
    }

    return children;
}

// ⭐ Neue Route-Komponente: Nur für Game-Creator (Admin/Host)
export function GameCreatorRoute({ children }) {
    const { user, loading, isGameCreator } = useAuth();

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

    // ⭐ Nur Admin und Host dürfen Spiele erstellen
    if (!isGameCreator()) {
        return <Navigate to="/forbidden" replace />;
    }

    return children;
}

export default ProtectedRoute;