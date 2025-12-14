// src/components/GameTable.jsx
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import RoundHeader from './rounds/RoundHeader';
import RoundData from './rounds/RoundData';
import { useToast } from '../context/ToastContext';
import { gameAPI } from '../services/api';
import './GameTable.css';

// Funktion zum Generieren zufälliger Bids (0-7)
const generateBids = (numPlayers) => {
    return Array.from({ length: numPlayers }, () => "-");
};

// Funktion zum Generieren von Tricks, deren Summe 7 ergibt (jeder 0-7)
const generateTricks = (numPlayers) => {
    return Array.from({ length: numPlayers }, () => "-");
};

// Funktion zum Generieren der Runden
const generateRounds = (numRounds, numPlayers) => {
    return Array.from({ length: numRounds }, (_, i) => {
        const bids = generateBids(numPlayers);
        const tricks = generateTricks(numPlayers);
        // Einfache Punkteberechnung für Demo: Punkte = Tricks
        const points = tricks.slice();
        return {
            round: i + 1,
            bids,
            tricks,
            points,
        };
    });
};

function GameTable({ gameData: initialGameData, gameId, onGameUpdate }) {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const tableRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);
    const [showTooltip, setShowTooltip] = useState(false);
    const [roundPhase, setRoundPhase] = useState(0); // 0 = bids, 1 = tricks
    const [isCorrectingTricks, setIsCorrectingTricks] = useState(false); // Flag für Korrektur-Modus
    const saveTimeoutRef = useRef(null);

    // Handler für Drag-to-Scroll
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - tableRef.current.offsetLeft);
        setStartY(e.pageY - tableRef.current.offsetTop);
        setScrollLeft(tableRef.current.scrollLeft);
        setScrollTop(tableRef.current.scrollTop);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - tableRef.current.offsetLeft;
        const y = e.pageY - tableRef.current.offsetTop;
        const walkX = (x - startX) * 2; // Geschwindigkeit horizontal
        const walkY = (y - startY) * 2; // Geschwindigkeit vertikal
        tableRef.current.scrollLeft = scrollLeft - walkX;
        tableRef.current.scrollTop = scrollTop - walkY;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleDealerClick = () => {
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 3000); // 3 Sekunden
    };

    // Funktion zur Berechnung der Tricks-Summe in einer Runde (ohne einen bestimmten Spieler)
    const getTricksSumForRound = (roundIndex, excludePlayerIndex = -1) => {
        const round = gameData.rounds[roundIndex];
        if (!round) return 0;

        return round.tricks.reduce((sum, tricks, playerIdx) => {
            if (playerIdx === excludePlayerIndex || tricks === '-') return sum;
            return sum + parseInt(tricks);
        }, 0);
    };

    // Funktion zur Prüfung, ob alle Tricks in einer Runde eingegeben sind
    const areAllTricksEnteredForRound = (roundIndex) => {
        const round = gameData.rounds[roundIndex];
        if (!round) return false;
        return round.tricks.every(tricks => tricks !== '-');
    };

    // Funktion zur Berechnung der Punkte für eine Runde
    const calculateRoundPoints = (bids, tricks) => {
        return bids.map((bid, index) => {
            const bidNum = parseInt(bid);
            const tricksNum = parseInt(tricks[index]);

            if (bidNum === tricksNum) {
                // Exakte Ansage: Stiche + 10 Bonus
                if (bidNum === 0) {
                    // Sonderfall: 0 angesagt und 0 erreicht = 20 Punkte
                    return 20;
                } else {
                    return tricksNum + 10;
                }
            } else {
                // Nicht exakt: nur die Stiche als Punkte
                return tricksNum;
            }
        });
    };

    // Funktion zur Berechnung des Rankings
    const calculateRanking = (players) => {
        // Erstelle Kopie mit ursprünglicher Index
        const playersWithIndex = players.map((p, i) => ({ ...p, originalIndex: i }));
        
        // Sortiere nach Punkten absteigend
        playersWithIndex.sort((a, b) => b.totalPoints - a.totalPoints);
        
        // Weise Ränge zu (mit übersprungenen Rängen bei Gleichstand)
        let currentRank = 1;
        playersWithIndex.forEach((player, index) => {
            if (index > 0 && player.totalPoints < playersWithIndex[index - 1].totalPoints) {
                currentRank = index + 1;
            }
            player.rank = currentRank;
        });
        
        // Sortiere zurück zur ursprünglichen Reihenfolge
        playersWithIndex.sort((a, b) => a.originalIndex - b.originalIndex);
        
        // Entferne originalIndex und gib zurück
        return playersWithIndex.map(({ originalIndex, ...p }) => p);
    };

    // Funktion zur Bestimmung der Ranking-Farbe
    const getRankingColor = (rank) => {
        if (rank === 1) return 'rank-1';
        if (rank === 2) return 'rank-2';
        if (rank === 3) return 'rank-3';
        return 'rank-other';
    };

    // Funktion zur Bestimmung des Ranking-Emojis
    const getRankingEmoji = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return '';
    };

    // Funktion zum Beenden des Spiels
    const finishGame = () => {
        // Navigation zur GameEvaluation Seite
        navigate(`/game-evaluation/${gameId}`);
    };

    // Funktion zum Pausieren des Spiels
    const handlePauseGame = async () => {
        try {
            await gameAPI.pauseGame(gameId);
            const parts = gameData.gameName.split('_');
            const gameTitle = parts[0];
            showToast(`⏸️ Spiel "${gameTitle}" wurde pausiert`, 'success', 3000);
            // Zur Startseite navigieren und Seite neu laden für aktualisierte Spiel-Liste
            window.location.href = '/';
        } catch (error) {
            console.error('Failed to pause game:', error);
            showToast('❌ Fehler beim Pausieren des Spiels', 'error');
        }
    };

    // Funktion zum Abbrechen des Spiels
    const handleCancelGame = async () => {
        if (window.confirm('⚠️ Spiel wirklich abbrechen und löschen? Alle Daten gehen verloren!')) {
            try {
                await gameAPI.deleteGame(gameId);
                const parts = gameData.gameName.split('_');
                const gameTitle = parts[0];
                showToast(`🗑️ Spiel "${gameTitle}" wurde abgebrochen und gelöscht`, 'warning', 5000);
                navigate('/');
            } catch (error) {
                console.error('Failed to cancel game:', error);
                showToast('❌ Fehler beim Abbrechen des Spiels', 'error');
            }
        }
    };

    // Konvertiere initialGameData in internes Format
    const convertGameData = (data) => {
        if (!data) return null;

        let players = data.players.map((player, index) => ({
            id: player.id || index + 1,
            name: player.name,
            userId: player.userId || null,
            totalPoints: 0,
            rank: 0,
        }));

        // Verwende die vorhandenen Runden aus den Daten, oder erstelle eine leere erste Runde
        let rounds = data.rounds || [];
        if (rounds.length === 0) {
            const numPlayers = players.length;
            const firstRound = {
                round: 1,
                bids: generateBids(numPlayers),
                tricks: generateTricks(numPlayers),
                points: Array(numPlayers).fill(0),
            };
            rounds = [firstRound];
        }

        // ⭐ PUNKTE UND RÄNGE NEU BERECHNEN beim Laden (NUR wenn Runde 1 abgeschlossen ist)
        const gameDataForCalculation = {
            gameName: data.gameName,
            players: players,
            rounds: rounds,
            currentRound: data.currentRound || 1,
            gameStatus: data.gameStatus || "active",
            victoryCondition: data.victoryCondition || 100,
            dealerIndex: data.dealerIndex || 0, // Fester Fallback auf 0 für bestehende Spiele
        };

        // Berechne Gesamtpunkte für alle Spieler neu (NUR wenn Runde 1 abgeschlossen ist)
        const shouldRecalculate = gameDataForCalculation.currentRound > 1;
        
        let playersWithCalculatedData = gameDataForCalculation.players;
        
        if (shouldRecalculate) {
            const playersWithTotalPoints = gameDataForCalculation.players.map((player, index) => {
                const totalPoints = gameDataForCalculation.rounds.reduce((sum, round) => {
                    return sum + (round.points ? (round.points[index] || 0) : 0);
                }, 0);
                return {
                    ...player,
                    totalPoints,
                };
            });

            // Berechne Ranking neu
            playersWithCalculatedData = calculateRanking(playersWithTotalPoints);
        }

        return {
            ...gameDataForCalculation,
            players: playersWithCalculatedData,
        };
    };

    const [gameData, setGameData] = useState(() => {
        const converted = convertGameData(initialGameData);
        if (converted) {
            // Keine Fake-Runden generieren
            return converted;
        }
        // Fallback, wenn keine Daten
        return {
            gameName: "Test-Spiel",
            players: [],
            rounds: [],
            currentRound: 1,
            gameStatus: "active",
            victoryCondition: 100,
            dealerIndex: 0,
        };
    });

    // Debounced Speicher-Funktion
    const debouncedSave = useCallback((data) => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = setTimeout(() => {
            if (onGameUpdate) {
                onGameUpdate(data);
            }
        }, 800); // ⏱️ Erhöht auf 800ms für Development-Performance
    }, [onGameUpdate]);

    // Cleanup beim Unmount
    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);

    const maxCards = gameData.players.length <= 6 ? 9 : 7;

    // Update gameData wenn initialGameData sich ändert
    useEffect(() => {
        const converted = convertGameData(initialGameData);
        if (converted) {
            setGameData(converted);
        }
    }, [initialGameData]);

    // Setze roundPhase basierend auf gameData Änderungen
    // ❌ Entfernt: Automatische Phasen-Wechsel führen zu unerwünschtem Verhalten
    // Phase wird nur manuell über confirmRound und confirmTricks gesteuert
    useEffect(() => {
        if (isCorrectingTricks) {
            setRoundPhase(1); // Bei Korrektur bleibe in Tricks-Phase
            setIsCorrectingTricks(false);
        }
    }, [isCorrectingTricks]);

    // Funktion zur Validierung der Tricks-Eingabe
    const validateTricksInput = (roundIdx, playerIdx, newTricks) => {
        const round = gameData.rounds[roundIdx];
        const currentTricks = round.tricks.map((t, i) => i === playerIdx ? newTricks : (t === '-' ? 0 : parseInt(t)));
        const sum = currentTricks.reduce((a, b) => a + b, 0);
        return sum <= maxCards * 2; // Erlaube temporäre Überschreitungen für Korrekturen
    };

    // Funktion zum Aktualisieren von Runden-Daten
    const updateRoundData = (roundIndex, playerIndex, field, value) => {
        setGameData(prevData => {
            const newRounds = [...prevData.rounds];
            if (!newRounds[roundIndex]) return prevData;

            if (field === 'bid') {
                newRounds[roundIndex].bids[playerIndex] = value;
            } else if (field === 'tricks') {
                newRounds[roundIndex].tricks[playerIndex] = value;
            }

            const updatedData = {
                ...prevData,
                rounds: newRounds,
            };

            // Speichere in sessionStorage
            sessionStorage.setItem('gameData', JSON.stringify(updatedData));

            // Debounced Speichern anstatt sofort
            debouncedSave(updatedData);

            return updatedData;
        });
    };

    // Auto-0-Setzen: Wenn max. Stiche erreicht, setze fehlende auf 0
    useEffect(() => {
        if (roundPhase === 1) { // Nur in Tricks-Phase
            const currentRoundIndex = gameData.currentRound - 1;
            const currentRound = gameData.rounds[currentRoundIndex];
            if (!currentRound) return;

            const numPlayers = gameData.players.length;
            const maxTricks = numPlayers <= 6 ? 9 : 7;
            const currentSum = getTricksSumForRound(currentRoundIndex);

            if (currentSum === maxTricks) {
                // Finde Spieler mit '-' in tricks und setze sie auf 0
                const playersToUpdate = [];
                currentRound.tricks.forEach((tricks, playerIndex) => {
                    if (tricks === '-') {
                        playersToUpdate.push(playerIndex);
                    }
                });

                if (playersToUpdate.length > 0) {
                    setGameData(prevData => {
                        const newRounds = [...prevData.rounds];
                        playersToUpdate.forEach(playerIndex => {
                            newRounds[currentRoundIndex].tricks[playerIndex] = 0;
                        });

                        const updatedData = {
                            ...prevData,
                            rounds: newRounds,
                        };

                        // Speichere in sessionStorage
                        sessionStorage.setItem('gameData', JSON.stringify(updatedData));

                        // Debounced Speichern
                        debouncedSave(updatedData);

                        return updatedData;
                    });
                }
            }
        }
    }, [gameData, roundPhase]);

    // Automatische Befüllung des letzten fehlenden Tricks-Felds
    useEffect(() => {
        if (roundPhase === 1) { // Nur in Tricks-Phase
            const currentRoundIndex = gameData.currentRound - 1;
            const currentRound = gameData.rounds[currentRoundIndex];
            const missingTricks = currentRound.tricks.map((t, i) => t === '-' ? i : null).filter(i => i !== null);
            if (missingTricks.length === 1) {
                const playerIndex = missingTricks[0];
                const sumOthers = currentRound.tricks.reduce((sum, t, i) => i !== playerIndex ? sum + (t === '-' ? 0 : parseInt(t)) : sum, 0);
                const autoTricks = maxCards - sumOthers;
                if (autoTricks >= 0) {
                    setGameData(prevData => {
                        const newRounds = [...prevData.rounds];
                        newRounds[currentRoundIndex].tricks[playerIndex] = autoTricks.toString();
                        const updatedData = {
                            ...prevData,
                            rounds: newRounds,
                        };
                        sessionStorage.setItem('gameData', JSON.stringify(updatedData));
                        // Debounced Speichern
                        debouncedSave(updatedData);
                        return updatedData;
                    });
                }
            }
        }
    }, [gameData, roundPhase, maxCards]);

    // Funktion zum Bestätigen der Runde und Wechsel zu Tricks-Phase
    const confirmRound = () => {
        if (roundPhase === 0) {
            // Wechsle zu Tricks-Phase
            setRoundPhase(1);
        } else {
            // Bestätige Tricks und starte neue Runde
            const success = confirmTricks();
            if (!success) {
                // Validierung fehlgeschlagen - bleibe in Phase 1 für Korrekturen
                setRoundPhase(1);
            }
            // Bei Erfolg wird die Phase in confirmTricks gesetzt
        }
    };

    // Funktion zum Bestätigen der Tricks und Starten der nächsten Runde
    const confirmTricks = () => {
        setGameData(prevData => {
            // Punkte für die aktuelle Runde berechnen
            const currentRoundIndex = prevData.currentRound - 1;
            const currentRound = prevData.rounds[currentRoundIndex];

            // Automatische Befüllung des letzten fehlenden Tricks-Felds
            const missingTricks = currentRound.tricks.map((t, i) => t === '-' ? i : null).filter(i => i !== null);
            if (missingTricks.length === 1) {
                const playerIndex = missingTricks[0];
                const sumOthers = currentRound.tricks.reduce((sum, t, i) => i !== playerIndex ? sum + (t === '-' ? 0 : parseInt(t)) : sum, 0);
                const autoTricks = maxCards - sumOthers;
                if (autoTricks >= 0) {
                    currentRound.tricks[playerIndex] = autoTricks.toString();
                }
            }

            // Prüfe, ob die Summe der Tricks korrekt ist
            const totalTricks = currentRound.tricks.reduce((sum, t) => sum + parseInt(t), 0);
            if (totalTricks !== maxCards) {
                // ❌ Validierung fehlgeschlagen: Tricks-Felder zurücksetzen und Toast anzeigen
                showToast(`Die Summe der Ergebnisse (Erg.) muss genau ${maxCards} sein! Aktuell: ${totalTricks}.\n\nDie Ergebnis-Felder wurden zurückgesetzt - bitte neu eingeben.`, "error", 8000);
                
                // Tricks-Felder zurücksetzen (nur aktuelle Runde)
                const updatedRounds = [...prevData.rounds];
                updatedRounds[currentRoundIndex] = {
                    ...currentRound,
                    tricks: currentRound.tricks.map(() => '-'), // Alle Tricks auf '-' setzen
                };
                
                // Speichern der zurückgesetzten Daten
                const newGameData = {
                    ...prevData,
                    rounds: updatedRounds,
                };
                
                // Speichere in sessionStorage
                sessionStorage.setItem('gameData', JSON.stringify(newGameData));
                
                // Debounced Speichern
                debouncedSave(newGameData);
                
                return newGameData; // Zurückgesetzte Daten zurückgeben
            }

            // Bei Validierungsfehler: Phase auf 1 setzen für Korrekturen
            setRoundPhase(1);

            // ✅ Validierung erfolgreich: Führe die normale Logik aus

            // Punkte zur aktuellen Runde hinzufügen
            const updatedRounds = [...prevData.rounds];
            updatedRounds[currentRoundIndex] = {
                ...currentRound,
                points: roundPoints,
            };

            // Gesamtpunkte aller Spieler neu berechnen
            const playersWithTotalPoints = prevData.players.map((player, index) => {
                const totalPoints = updatedRounds.reduce((sum, round) => {
                    return sum + (round.points[index] || 0);
                }, 0);
                return {
                    ...player,
                    totalPoints,
                };
            });

            // Ranking berechnen
            const playersWithRanks = calculateRanking(playersWithTotalPoints);

            // Siegbedingung prüfen
            const victoryPoints = prevData.victoryCondition;
            const hasWinner = playersWithRanks.some(player => player.totalPoints >= victoryPoints);

            let newGameData;
            if (hasWinner) {
                // Spiel beendet - keine neue Runde
                newGameData = {
                    ...prevData,
                    rounds: updatedRounds,
                    players: playersWithRanks,
                    gameStatus: 'finished',
                };
            } else {
                // Neue Runde hinzufügen
                const numPlayers = prevData.players.length;
                const newDealerIndex = (prevData.dealerIndex + 1) % numPlayers;
                const newRoundNumber = prevData.currentRound + 1;
                const newRound = {
                    round: newRoundNumber,
                    bids: generateBids(numPlayers),
                    tricks: generateTricks(numPlayers),
                    points: Array(numPlayers).fill(0),
                };

                newGameData = {
                    ...prevData,
                    rounds: [...updatedRounds, newRound],
                    players: playersWithRanks,
                    currentRound: newRoundNumber,
                    dealerIndex: newDealerIndex,
                };
            }

            // Speichere in sessionStorage
            sessionStorage.setItem('gameData', JSON.stringify(newGameData));

            // Debounced Speichern
            debouncedSave(newGameData);

            return newGameData;
        });

        // Phase zurücksetzen für neue Runde (falls Spiel weitergeht)
        setRoundPhase(0);
    };

    const currentTotals = gameData.players;

    // Prüfe, ob die aktuelle Runde vollständig ausgefüllt ist
    const isRoundComplete = useMemo(() => {
        const currentRoundData = gameData.rounds[gameData.currentRound - 1];
        if (!currentRoundData) return false;

        if (roundPhase === 0) {
            // Phase 0: Alle Bids müssen gesetzt sein
            return currentRoundData.bids.every(bid => bid !== '-');
        } else {
            // Phase 1: Alle Tricks müssen gesetzt sein
            return currentRoundData.tricks.every(trick => trick !== '-');
        }
    }, [gameData, roundPhase]);

    return (
        <div className="game-table">
            <div className="game-table__inner" 
                 ref={tableRef}
                 onMouseDown={handleMouseDown}
                 onMouseMove={handleMouseMove}
                 onMouseUp={handleMouseUp}
                 onMouseLeave={handleMouseLeave}
                 style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
                <div className="game-table__header">
                    <h3>{(() => {
                        // Parse gameName: Titel_TIMESTAMP_UUID
                        const parts = (gameData.gameName || "Spiel-Tabelle").split('_');
                        return parts[0]; // Nur der Titel vor dem ersten Unterstrich
                    })()}</h3>
                    {(() => {
                        // Extrahiere Timestamp und UUID aus gameName
                        const parts = (gameData.gameName || "").split('_');
                        if (parts.length >= 3) {
                            let timestamp = parseInt(parts[1]); // Timestamp als Zahl
                            const uuid = parts[2];
                            
                            // Prüfe ob es Millisekunden oder Sekunden sind
                            // Wenn Timestamp unrealistisch alt ist (< 2000), dann * 1000 für Sekunden
                            if (timestamp < 1577836800000) { // 2020-01-01 in MS
                                timestamp *= 1000; // Konvertiere Sekunden zu Millisekunden
                            }
                            
                            // Konvertiere Timestamp zu Datum
                            const date = new Date(timestamp);
                            const dateStr = date.toLocaleDateString('de-DE');
                            
                            return (
                                <div className="game-table__header-info">
                                    am <strong>{dateStr}</strong>
                                    <span className="muted">({uuid})</span>
                                    <div className="game-table__victory-condition">
                                        🏆 Sieg bei {gameData.victoryCondition} Punkten
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })()}
                </div>

                <div className="game-table__rows">
                {/* Header-Zeile */}
                <div className="game-table__header-row">
                    <div className="game-table__player-cell game-table__header-cell">
                        Spieler
                    </div>
                    <div className="game-table__rounds-container">
                        {gameData.rounds.map(r => (
                            <RoundHeader key={r.round} roundNumber={r.round} />
                        ))}
                    </div>
                    <div className="game-table__stats-container">
                        <div className="game-table__points-cell game-table__header-cell">
                            Pkte
                        </div>
                        <div className="game-table__rank-cell game-table__header-cell">
                            Rang
                        </div>
                    </div>
                </div>
                {/* Spieler-Zeilen */}
                {currentTotals.map((player, playerIndex) => (
                    <div key={player.id} className="game-table__row">
                        <div className={`game-table__player-cell ${playerIndex === gameData.dealerIndex ? 'game-table__player-cell--dealer' : ''}`} onClick={playerIndex === gameData.dealerIndex ? handleDealerClick : undefined}>
                            {player.name}
                        </div>
                        <div className="game-table__rounds-container">
                            {gameData.rounds.map((r, roundIndex) => (
                                <RoundData 
                                    key={r.round} 
                                    bid={r.bids[playerIndex]} 
                                    tricks={r.tricks[playerIndex]} 
                                    onUpdate={updateRoundData}
                                    roundIndex={roundIndex}
                                    playerIndex={playerIndex}
                                    numPlayers={gameData.players.length}
                                    roundNumber={r.round}
                                    roundPhase={roundPhase}
                                    currentRound={gameData.currentRound}
                                    validateTricksInput={validateTricksInput}
                                    maxCards={maxCards}
                                    isEvaluated={roundIndex < gameData.currentRound - 1 || gameData.gameStatus === 'finished'}
                                    isColorEvaluated={roundIndex < gameData.currentRound - 1 || gameData.gameStatus === 'finished'}
                                    isCorrectBid={playerIndex < r.bids.length && playerIndex < r.tricks.length && r.bids[playerIndex] !== '-' && r.tricks[playerIndex] !== '-' && parseInt(r.bids[playerIndex]) === parseInt(r.tricks[playerIndex])}
                                    playerName={player.name}
                                    isGameFinished={gameData.gameStatus === 'finished'}
                                />
                            ))}
                        </div>
                        <div className="game-table__stats-container">
                            <div className="game-table__points-cell">
                                {player.totalPoints}
                            </div>
                            <div className={`game-table__rank-cell ${getRankingColor(player.rank)}`}>
                                {getRankingEmoji(player.rank)} {player.rank}
                            </div>
                        </div>
                    </div>
                ))}
                </div>

                <div className="game-table__actions">
                    <div className="game-table__dealer-info">
                        Dealer: {gameData.players[gameData.dealerIndex]?.name || 'Unbekannt'}
                    </div>
                    <div className="game-table__buttons">
                        {gameData.gameStatus === 'finished' ? (
                            <button className="btn btn-success" onClick={finishGame}>
                                Spiel beenden & Auswerten
                            </button>
                        ) : (
                            <button className="btn btn-primary" disabled={!isRoundComplete} onClick={confirmRound}>
                                {roundPhase === 0 ? 'Eingaben bestätigen?' : 'Stiche bestätigen?'}
                            </button>
                        )}
                        <button className="btn btn-warning" onClick={handlePauseGame}>
                            ⏸️ Spiel pausieren
                        </button>
                        <button className="btn btn-danger" onClick={handleCancelGame}>
                            🗑️ Spiel abbrechen
                        </button>
                    </div>
                </div>

                {showTooltip && (
                    <div className="game-table__tooltip">
                        Dieser Spieler ist Dealer für diese Runde
                    </div>
                )}
            </div>
        </div>
    );
}export default GameTable;
