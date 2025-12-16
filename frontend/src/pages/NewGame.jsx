// src/pages/NewGame.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUserContext } from "../context/UserContext";
import { useUnsavedChanges } from "../context/UnsavedChangesContext";
import PlayerCountSelector from "../components/newgame/PlayerCountSelector";
import PlayerInput from "../components/newgame/PlayerInput";
import GameNameInput from "../components/newgame/GameNameInput";
import VictoryConditionSelector from "../components/newgame/VictoryConditionSelector";
import "../styles/pages/newgame.css";

function NewGame() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { users: availableEmails, loading: usersLoading, loadUsers, clearCache } = useUserContext();
    const { hasUnsavedChanges, setHasUnsavedChanges } = useUnsavedChanges();

    const restoredData = location.state || {};
    const [playerCount, setPlayerCount] = useState(restoredData.playerCount || 5);
    const [players, setPlayers] = useState(() => {
        const restored = restoredData.players || [];
        const count = restoredData.playerCount || 5;
        while (restored.length < count) {
            restored.push(null);
        }
        return restored;
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [gameName, setGameName] = useState(restoredData.gameName || '');
    const [gameNameInput, setGameNameInput] = useState('');
    const [victoryPoints, setVictoryPoints] = useState(restoredData.victoryPoints || (100 + new Date().getDate()));
    
    const MAX_PLAYERS_CACHE = 11;

    // Initialize users
    useEffect(() => {
        if (availableEmails.length === 0 && !usersLoading) {
            clearCache();
            loadUsers(true);
        }
        setLoading(false);
    }, [availableEmails.length, usersLoading, loadUsers, clearCache]);

    // Handle game name change
    const handleGameNameChange = (fullName, inputPart) => {
        setGameName(fullName);
        setGameNameInput(inputPart);
    };

    // Handle player count change
    const handlePlayerCountChange = (count) => {
        setPlayerCount(count);
        setPlayers(prev => {
            const newPlayers = [...prev];
            while (newPlayers.length < count) {
                newPlayers.push(null);
            }
            return newPlayers;
        });
    };

    // Handle victory condition change
    const handleVictoryConditionChange = (points) => {
        setVictoryPoints(points);
    };

    // Handle player change - FIXED: removed faulty reset logic
    const handlePlayerChange = (playerData) => {
        setPlayers((prev) => {
            const updated = [...prev];
            updated[playerData.playerNumber - 1] = playerData;
            return updated;
        });
    };

    // Form validation
    const isFormValid = () => {
        const hasGameName = gameName.trim().length > 0 && !/\s/.test(gameName);
        const playersValid = players
            .slice(0, playerCount)
            .every((p) => p && !p.hasError && p.name && p.name.trim().length > 0);
        return hasGameName && playersValid;
    };

    // Submit handler
    const handleSubmit = (e) => {
        e.preventDefault();
        setHasUnsavedChanges(false);
        navigate('/game-summary', {
            state: {
                gameName,
                playerCount,
                players: players.slice(0, playerCount),
                victoryPoints,
            }
        });
    };

    // Render player inputs
    const renderPlayerInputs = () => {
        const inputs = [];
        for (let i = 1; i <= playerCount; i++) {
            const existingPlayerData = players[i - 1];
            inputs.push(
                <PlayerInput
                    key={`player-${i}`}
                    playerNumber={i}
                    currentUser={i === 1 ? user : null}
                    availableEmails={availableEmails}
                    usedEmails={[]}
                    usedGuestNames={[]}
                    allPlayerNames={[]}
                    onPlayerChange={handlePlayerChange}
                    isCurrentUser={i === 1}
                    existingData={existingPlayerData}
                    onRemovePlayer={i !== 1 ? () => {} : null}
                    loading={usersLoading}
                />
            );
        }
        return inputs;
    };

    if (loading) {
        return (
            <div className="newgame">
                <div className="newgame__container">
                    <div className="loading-state">
                        <p> Lade Spielerdaten...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="newgame">
            <div className="newgame__container">
                <h1 className="newgame__title"> Neues Spiel</h1>
                <p className="newgame__subtitle">Erstelle ein neues Spiel</p>

                <form onSubmit={handleSubmit}>
                    <fieldset className="form-section">
                        <legend className="form-legend"> Basisdaten</legend>
                        <GameNameInput
                            value={gameNameInput}
                            onChange={handleGameNameChange}
                            required={true}
                            initialFullName={restoredData.gameName}
                            isValid={gameName.trim().length > 0 && !/\s/.test(gameName)}
                        />
                        <VictoryConditionSelector
                            onChange={handleVictoryConditionChange}
                            initialValue={restoredData.victoryPoints}
                        />
                    </fieldset>

                    <fieldset className="form-section">
                        <legend className="form-legend"> Spieler ({playerCount})</legend>
                        <PlayerCountSelector
                            value={playerCount}
                            onChange={handlePlayerCountChange}
                            maxPlayers={MAX_PLAYERS_CACHE}
                        />
                        <div className="players-grid">{renderPlayerInputs()}</div>
                    </fieldset>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={() => navigate("/")}
                        >
                            Abbrechen
                        </button>
                        <div title={!isFormValid() ? "Einige Felder sind noch nicht korrekt ausgefüllt." : ""}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={!isFormValid()}
                            >
                                Weiter zur Übersicht 
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewGame;
