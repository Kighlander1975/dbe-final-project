// src/components/GameTable.jsx
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import RoundHeader from './rounds/RoundHeader';
import RoundData from './rounds/RoundData';
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

function GameTable({ gameData: initialGameData, onGameUpdate, gameCreatedAt }) {
    const tableRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);
    const [showTooltip, setShowTooltip] = useState(false);
    const [roundPhase, setRoundPhase] = useState(0); // 0 = bids, 1 = tricks
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
        // Navigation zur GameSummary Seite
        window.location.href = '/game-summary';
    };
    // Konvertiere initialGameData in internes Format
    const convertGameData = (data) => {
        if (!data) return null;

        let players = data.players.map((player, index) => ({
            id: player.id || index + 1,
            name: player.name,
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

        // ⭐ PUNKTE UND RÄNGE NEU BERECHNEN beim Laden
        const gameDataForCalculation = {
            gameName: data.gameName,
            players: players,
            rounds: rounds,
            currentRound: data.currentRound || 1,
            gameStatus: data.gameStatus || "active",
            victoryCondition: data.victoryCondition || 100,
            dealerIndex: data.dealerIndex || Math.floor(Math.random() * players.length),
        };

        // Berechne Gesamtpunkte für alle Spieler neu
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
        const playersWithRanks = calculateRanking(playersWithTotalPoints);

        return {
            ...gameDataForCalculation,
            players: playersWithRanks,
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
        }, 1000); // 1 Sekunde warten nach der letzten Änderung
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
            confirmTricks();
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
                alert(`Die Summe der Tricks muss genau ${maxCards} sein! Aktuell: ${totalTricks}. Bitte korrigieren Sie die Eingaben.`);
                return prevData; // Nicht bestätigen
            }

            const roundPoints = calculateRoundPoints(currentRound.bids, currentRound.tricks);

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
            const victoryPoints = 100 + new Date().getDate(); // 100 + Tageszahl
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
                    <h3>{gameData.gameName || "Spiel-Tabelle"}</h3>
                    {gameCreatedAt && (
                        <div className="game-table__header-info">
                            am <strong>{new Date(gameCreatedAt).toLocaleDateString('de-DE')}</strong>
                            <span className="muted">({gameId})</span>
                        </div>
                    )}
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
                                    isCorrectBid={playerIndex < r.bids.length && playerIndex < r.tricks.length && r.bids[playerIndex] !== '-' && r.tricks[playerIndex] !== '-' && r.bids[playerIndex] === r.tricks[playerIndex]}
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
                        <button className="btn btn-secondary" disabled={gameData.gameStatus === 'finished'}>Spiel abbrechen</button>
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
