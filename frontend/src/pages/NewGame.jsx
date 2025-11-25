// src/pages/NewGame.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLoading } from "../context/LoadingContext"; // ✅ NEU
import { userAPI } from "../services/api";
import PlayerCountSelector from "../components/newgame/PlayerCountSelector";
import PlayerInput from "../components/newgame/PlayerInput";
import "../styles/pages/newgame.css";

function NewGame() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { startLoading, stopLoading } = useLoading(); // ✅ NEU

    // State
    const [playerCount, setPlayerCount] = useState(5);
    const [players, setPlayers] = useState([]);
    const [availableEmails, setAvailableEmails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const MAX_PLAYERS_CACHE = 11;

    // User-Liste beim Laden abrufen
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // ✅ Loading starten
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
                
                // ✅ Loading stoppen
                stopLoading();
            } catch (err) {
                console.error("❌ Fehler beim Laden der User:", err);
                setError("Benutzerliste konnte nicht geladen werden");
                setLoading(false);
                
                // ✅ Loading stoppen
                stopLoading();
            }
        };

        fetchUsers();
    }, []);

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
        return players
            .slice(0, playerCount)
            .every((p) => p && !p.hasError);
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
            <form className="newgame__form">
                {/* Header */}
                <div className="newgame__header">
                    <h1 className="newgame__title">🎮 Neues Spiel</h1>
                </div>

                {/* FIELDSET 1: BASISDATEN */}
                <fieldset className="form-fieldset">
                    <legend className="form-legend">📋 Basisdaten</legend>

                    {/* Spielname */}
                    <div className="form-group">
                        <label htmlFor="gameName" className="form-label">
                            Spielname
                        </label>
                        <div className="gamename-wrapper">
                            <input
                                type="text"
                                id="gameName"
                                className="form-input form-input--gamename"
                                placeholder="Mein Spiel"
                                defaultValue=""
                                required
                            />
                            <span className="gamename-suffix">
                                _1732438620_a3f2c1d4
                            </span>
                        </div>
                        <p className="form-hint">
                            💡 Der Suffix wird automatisch generiert
                        </p>
                    </div>

                    {/* Anzahl Spieler */}
                    <PlayerCountSelector
                        initialCount={5}
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
