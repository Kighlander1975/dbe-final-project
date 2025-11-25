// src/pages/NewGame.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ useLocation hinzugefügt
import { useAuth } from "../context/AuthContext";
import { useLoading } from "../context/LoadingContext";
import { userAPI } from "../services/api";
import PlayerCountSelector from "../components/newgame/PlayerCountSelector";
import PlayerInput from "../components/newgame/PlayerInput";
import GameNameInput from "../components/newgame/GameNameInput";
import "../styles/pages/newgame.css";

function NewGame() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // ✅ NEU
    const { startLoading, stopLoading } = useLoading();

    // ✅ NEU: Daten aus Navigation State holen (falls vorhanden)
    const restoredData = location.state || {};

    // State
    const [playerCount, setPlayerCount] = useState(restoredData.playerCount || 5); // ✅ Wiederhergestellt
    const [players, setPlayers] = useState(restoredData.players || []); // ✅ Wiederhergestellt
    const [availableEmails, setAvailableEmails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [gameName, setGameName] = useState(restoredData.gameName || ''); // ✅ Wiederhergestellt
    const [gameNameInput, setGameNameInput] = useState(''); // ✅ Wird in GameNameInput gesetzt
    
    const MAX_PLAYERS_CACHE = 11;

    // User-Liste beim Laden abrufen
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null);
                startLoading('Lade Spielerdaten...');

                const response = await userAPI.getAll();
                console.log("📥 User-Liste geladen:", response);

                const users = response.data || response;
                const emailList = users.map((user) => ({
                    email: user.email,
                    name: user.name,
                    id: user.id,
                }));

                setAvailableEmails(emailList);
                setLoading(false);
                stopLoading();
            } catch (err) {
                console.error("❌ Fehler beim Laden der User:", err);
                setError("Benutzerliste konnte nicht geladen werden");
                setLoading(false);
                stopLoading();
            }
        };

        fetchUsers();
    }, []);

    // Handler für Spielname-Änderung
    const handleGameNameChange = (fullName, inputPart) => {
        setGameName(fullName);
        setGameNameInput(inputPart);
        console.log('🎮 Spielname:', fullName);
    };

    // Handler für Spieleranzahl-Änderung
    const handlePlayerCountChange = (count) => {
        setPlayerCount(count);
    };

    // Handler für Spieler-Daten-Änderung
    const handlePlayerChange = (playerData) => {
        setPlayers((prev) => {
            const updated = [...prev];
            updated[playerData.playerNumber - 1] = playerData;
            return updated;
        });
    };

    // Berechne bereits verwendete E-Mails (exkl. aktueller Spieler)
    const getUsedEmails = (excludePlayerNumber = null) => {
        return players
            .filter((p) => {
                if (!p || !p.email) return false;
                if (excludePlayerNumber && p.playerNumber === excludePlayerNumber) {
                    return false;
                }
                return true;
            })
            .map((p) => p.email);
    };

    // Berechne bereits verwendete Gast-Namen (exkl. aktueller Spieler)
    const getUsedGuestNames = (excludePlayerNumber = null) => {
        return players
            .filter((p) => {
                if (!p || p.email || !p.name) return false;
                if (excludePlayerNumber && p.playerNumber === excludePlayerNumber) {
                    return false;
                }
                return true;
            })
            .map((p) => p.name.toLowerCase());
    };

    // Berechne alle Namen (E-Mail-User + Gäste) für Name-Overlap-Check
    const getAllPlayerNames = (excludePlayerNumber = null) => {
        return players
            .filter((p) => {
                if (!p || !p.name) return false;
                if (excludePlayerNumber && p.playerNumber === excludePlayerNumber) {
                    return false;
                }
                return true;
            })
            .map((p) => p.name.toLowerCase());
    };

    // Generiere Spieler-Inputs
    const renderPlayerInputs = () => {
        const inputs = [];

        for (let i = 1; i <= playerCount; i++) {
            const usedEmails = getUsedEmails(i);
            const usedGuestNames = getUsedGuestNames(i);
            const allPlayerNames = getAllPlayerNames(i);
            
            const existingPlayerData = players[i - 1];
            
            inputs.push(
                <PlayerInput
                    key={`player-${i}`}
                    playerNumber={i}
                    currentUser={i === 1 ? user : null}
                    availableEmails={availableEmails}
                    usedEmails={usedEmails}
                    usedGuestNames={usedGuestNames}
                    allPlayerNames={allPlayerNames}
                    onPlayerChange={handlePlayerChange}
                    isCurrentUser={i === 1}
                    existingData={existingPlayerData}
                />
            );
        }

        return inputs;
    };

    // Prüfe, ob Form valide ist (keine Fehler)
    const isFormValid = () => {
        const hasGameName = gameNameInput.trim().length > 0;
        const playersValid = players
            .slice(0, playerCount)
            .every((p) => p && !p.hasError);
        
        return hasGameName && playersValid;
    };

    // Submit-Handler
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Navigiere zur Summary-Seite mit allen Daten
        navigate('/game-summary', {
            state: {
                gameName,
                playerCount,
                players: players.slice(0, playerCount),
            }
        });
    };

    // Loading State
    if (loading) {
        return (
            <div className="newgame">
                <div className="newgame__form">
                    <div className="loading-state">
                        <p>⏳ Lade Spielerdaten...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="newgame">
                <div className="newgame__form">
                    <div className="error-state">
                        <p>❌ {error}</p>
                        <button
                            className="btn btn-secondary"
                            onClick={() => window.location.reload()}
                        >
                            Erneut versuchen
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="newgame">
            <form className="newgame__form" onSubmit={handleSubmit}>
                {/* Header */}
                <div className="newgame__header">
                    <h1 className="newgame__title">🎮 Neues Spiel</h1>
                </div>

                {/* FIELDSET 1: BASISDATEN */}
                <fieldset className="form-fieldset">
                    <legend className="form-legend">📋 Basisdaten</legend>

                    {/* ✅ GameNameInput mit restoredData */}
                    <GameNameInput
                        value={gameNameInput}
                        onChange={handleGameNameChange}
                        required={true}
                        initialFullName={restoredData.gameName} // ✅ NEU: Vollständiger Name übergeben
                    />

                    {/* ✅ PlayerCountSelector mit restoredData */}
                    <PlayerCountSelector
                        initialCount={playerCount} // ✅ Bereits wiederhergestellt
                        onChange={handlePlayerCountChange}
                    />
                </fieldset>

                {/* FIELDSET 2: SPIELERDATEN */}
                <fieldset className="form-fieldset">
                    <legend className="form-legend">👥 Spielerdaten</legend>

                    <div className="players-grid">{renderPlayerInputs()}</div>
                </fieldset>

                {/* Form Actions */}
                <div className="form-actions">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate("/")}
                    >
                        Abbrechen
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={!isFormValid()}
                    >
                        Weiter zur Übersicht →
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NewGame;
