// src/pages/NewGame.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useBlocker } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLoading } from "../context/LoadingContext";
import { useUserContext } from "../context/UserContext"; // 🆕 UserContext
import { userAPI } from "../services/api";
import PlayerCountSelector from "../components/newgame/PlayerCountSelector";
import PlayerInput from "../components/newgame/PlayerInput";
import GameNameInput from "../components/newgame/GameNameInput";
import VictoryConditionSelector from "../components/newgame/VictoryConditionSelector"; // 🆕 Siegbedingung
import "../styles/pages/newgame.css";

function NewGame() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // ✅ NEU
    const { startLoading, stopLoading } = useLoading();
    const { users: availableEmails, loading: usersLoading, loadUsers } = useUserContext(); // 🆕 UserContext

    // ✅ NEU: Daten aus Navigation State holen (falls vorhanden)
    const restoredData = location.state || {};

    // State
    const [playerCount, setPlayerCount] = useState(restoredData.playerCount || 5); // ✅ Wiederhergestellt
    const [players, setPlayers] = useState(restoredData.players || []); // ✅ Wiederhergestellt
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [gameName, setGameName] = useState(restoredData.gameName || ''); // ✅ Wiederhergestellt
    const [gameNameInput, setGameNameInput] = useState(''); // ✅ Wird in GameNameInput gesetzt
    const [victoryPoints, setVictoryPoints] = useState(restoredData.victoryPoints || 100); // 🆕 Siegbedingung
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false); // 🆕 Schutz nur bei Änderungen
    
    const MAX_PLAYERS_CACHE = 11;
    const initialPlayerCount = restoredData.playerCount || 5; // 🆕 Ursprüngliche Spieleranzahl

    // 🆕 Prüfe, ob ungespeicherte Änderungen vorliegen
    const isDirty = () => {
        return gameNameInput.trim() !== '' || 
               playerCount !== initialPlayerCount || 
               victoryPoints !== 100 || // 🆕 Siegbedingung prüfen
               players.slice(1, playerCount).some(p => p && (p.name || p.email)); // 🆕 Ignoriere Spieler 1 (currentUser)
    };

    // 🆕 User-Liste beim Mount laden (falls nicht schon geladen)
    useEffect(() => {
        if (availableEmails.length === 0 && !usersLoading) {
            loadUsers();
        }
        setLoading(false); // Entferne loading, da UserContext das handhabt
    }, [availableEmails.length, usersLoading, loadUsers]);

    // 🆕 Schutz vor Datenverlust: Warnung beim Verlassen der Seite
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasUnsavedChanges && localStorage.getItem('gameActive') !== 'true') {
                e.preventDefault();
                e.returnValue = 'Du hast ungespeicherte Änderungen. Möchtest du wirklich die Seite verlassen? Alle Daten gehen verloren.';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);

    // 🆕 Blocker für interne Navigation (z.B. Menüleiste)
    const blocker = useBlocker(hasUnsavedChanges && localStorage.getItem('gameActive') !== 'true');

    useEffect(() => {
        if (blocker.state === 'blocked') {
            const confirmLeave = window.confirm(
                'Du hast ungespeicherte Änderungen. Möchtest du wirklich die Seite verlassen? Alle Daten gehen verloren.'
            );
            if (confirmLeave) {
                blocker.proceed(); // Erlaube Navigation
            } else {
                blocker.reset(); // Blockiere Navigation
            }
        }
    }, [blocker]);

    // Handler für Spielname-Änderung
    const handleGameNameChange = (fullName, inputPart) => {
        const newIsDirty = inputPart.trim() !== '' || 
                          playerCount !== initialPlayerCount || 
                          victoryPoints !== 100 || // 🆕 Siegbedingung prüfen
                          players.slice(1, playerCount).some(p => p && (p.name || p.email)); // 🆕 Ignoriere Spieler 1
        setGameName(fullName);
        setGameNameInput(inputPart);
        setHasUnsavedChanges(newIsDirty); // 🆕 Sofort mit neuen Werten prüfen
        console.log('🎮 Spielname:', fullName);
    };

    // Handler für Spieleranzahl-Änderung
    const handlePlayerCountChange = (count) => {
        const newIsDirty = count !== initialPlayerCount || 
                          gameNameInput.trim() !== '' || 
                          victoryPoints !== 100 || // 🆕 Siegbedingung prüfen
                          players.slice(1, count).some(p => p && (p.name || p.email)); // 🆕 Ignoriere Spieler 1
        console.log('🔢 handlePlayerCountChange:', { count, initialPlayerCount, gameNameInput: gameNameInput.trim(), playersSlice: players.slice(1, count), newIsDirty });
        setPlayerCount(count);
        setHasUnsavedChanges(newIsDirty); // 🆕 Sofort mit neuen Werten prüfen
    };

    // Handler für Siegbedingung-Änderung
    const handleVictoryConditionChange = (points) => {
        const newIsDirty = gameNameInput.trim() !== '' || 
                          playerCount !== initialPlayerCount || 
                          points !== 100 || // 🆕 Siegbedingung prüfen
                          players.slice(1, playerCount).some(p => p && (p.name || p.email)); // 🆕 Ignoriere Spieler 1
        setVictoryPoints(points);
        setHasUnsavedChanges(newIsDirty); // 🆕 Sofort mit neuen Werten prüfen
        console.log('🏆 Siegbedingung:', points);
    };
    const handlePlayerChange = (playerData) => {
        setPlayers((prev) => {
            const updated = [...prev];
            updated[playerData.playerNumber - 1] = playerData;
            const newPlayers = updated;
            const newIsDirty = gameNameInput.trim() !== '' || 
                              playerCount !== initialPlayerCount || 
                              victoryPoints !== 100 || // 🆕 Siegbedingung prüfen
                              newPlayers.slice(1, playerCount).some(p => p && (p.name || p.email)); // 🆕 Ignoriere Spieler 1
            setHasUnsavedChanges(newIsDirty); // 🆕 Sofort mit neuen Werten prüfen
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
        const hasGameName = gameName.trim().length > 0;
        const playersValid = players
            .slice(0, playerCount)
            .every((p) => p && !p.hasError);
        
        return hasGameName && playersValid;
    };

    // Submit-Handler
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // 🆕 Schutz deaktivieren vor Navigation
        setHasUnsavedChanges(false);
        
        // Navigiere zur Summary-Seite mit allen Daten
        navigate('/game-summary', {
            state: {
                gameName,
                playerCount,
                players: players.slice(0, playerCount),
                victoryPoints, // 🆕 Siegbedingung hinzufügen
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

                    {/* 🆕 VictoryConditionSelector */}
                    <VictoryConditionSelector
                        onChange={handleVictoryConditionChange}
                        initialValue={restoredData.victoryPoints}
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
