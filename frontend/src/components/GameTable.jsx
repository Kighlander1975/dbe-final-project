// src/components/GameTable.jsx
import React, { useState } from 'react';
import './GameTable.css';

function GameTable({ gameData: initialGameData }) {
    // Konvertiere initialGameData in internes Format
    const convertGameData = (data) => {
        if (!data) return null;

        return {
            gameName: data.gameName,
            players: data.players.map((player, index) => ({
                id: player.id || index + 1,
                name: player.name,
                totalPoints: 0,
                rank: 0
            })),
            rounds: [],
            currentRound: 1,
            gameStatus: 'active',
            victoryCondition: data.victoryPoints || 100
        };
    };

    const [gameData, setGameData] = useState(convertGameData(initialGameData) || {
        players: [
            { id: 1, name: 'Spieler 1', totalPoints: 0, rank: 0 },
            { id: 2, name: 'Spieler 2', totalPoints: 0, rank: 0 },
            { id: 3, name: 'Spieler 3', totalPoints: 0, rank: 0 },
            { id: 4, name: 'Spieler 4', totalPoints: 0, rank: 0 },
            { id: 5, name: 'Spieler 5', totalPoints: 0, rank: 0 }
        ],
        rounds: [
            // Beispiel-Runde für Demo
            {
                id: 1,
                bids: [2, 4, 2, 3, 0], // Ansagen pro Spieler
                tricks: [1, 1, 2, 4, 1], // Tatsächliche Stiche
                points: [1, 1, 2, 4, 1], // Punkte pro Spieler für diese Runde
                status: 'completed' // 'active', 'completed'
            }
        ],
        currentRound: 1,
        gameStatus: 'active', // 'active', 'paused', 'finished'
        victoryCondition: 110
    });

    // Funktion zum Berechnen der Gesamtpunkte und Ränge
    const calculateTotals = () => {
        const updatedPlayers = gameData.players.map(player => {
            const totalPoints = gameData.rounds.reduce((sum, round) => {
                const playerIndex = gameData.players.findIndex(p => p.id === player.id);
                return sum + (round.points[playerIndex] || 0);
            }, 0);

            return { ...player, totalPoints };
        });

        // Ränge berechnen (höhere Punkte = besserer Rang)
        const sortedPlayers = [...updatedPlayers].sort((a, b) => b.totalPoints - a.totalPoints);
        sortedPlayers.forEach((player, index) => {
            const originalPlayer = updatedPlayers.find(p => p.id === player.id);
            originalPlayer.rank = index + 1;
        });

        return updatedPlayers;
    };

    const currentTotals = calculateTotals();

    return (
        <div className="game-table">
            <div className="game-table__header">
                <h2>{gameData.gameName || 'Spiel-Tabelle'}</h2>
                <div className="game-table__info">
                    <span>Aktuelle Runde: {gameData.currentRound}</span>
                    <span>Status: {gameData.gameStatus}</span>
                    <span>Siegbedingung: {gameData.victoryCondition}</span>
                </div>
            </div>

            <div className="game-table__container">
                {/* Fixe linke Spalte: Spieler */}
                <div className="game-table__fixed-left">
                    <div className="game-table__cell game-table__header-cell">Spieler</div>
                    {gameData.players.map(player => (
                        <div key={player.id} className="game-table__cell">
                            {player.name}
                        </div>
                    ))}
                </div>

                {/* Scrollbare Mitte: Runden */}
                <div className="game-table__scrollable">
                    {gameData.rounds.length > 0 ? (
                        gameData.rounds.map(round => (
                            <div key={round.id} className="game-table__round-column">
                                <div className="game-table__cell game-table__header-cell">
                                    R{round.id}-Ans
                                </div>
                                {round.bids.map((bid, index) => (
                                    <div key={index} className="game-table__cell">
                                        {bid}
                                    </div>
                                ))}
                                <div className="game-table__cell game-table__header-cell">
                                    R{round.id}-Erg
                                </div>
                                {round.tricks.map((trick, index) => (
                                    <div key={index} className="game-table__cell">
                                        {trick}
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <div className="game-table__placeholder">
                            Runden werden hier angezeigt
                        </div>
                    )}
                </div>

                {/* Fixe rechte Spalten: Gesamt & Rang */}
                <div className="game-table__fixed-right">
                    <div className="game-table__cell game-table__header-cell">Gesamt</div>
                    {currentTotals.map(player => (
                        <div key={player.id} className="game-table__cell">
                            {player.totalPoints}
                        </div>
                    ))}
                    <div className="game-table__cell game-table__header-cell">Rang</div>
                    {currentTotals.map(player => (
                        <div key={player.id} className="game-table__cell">
                            {player.rank}
                        </div>
                    ))}
                </div>
            </div>

            <div className="game-table__actions">
                <button className="btn btn-primary">Eingaben bestätigen</button>
                <button className="btn btn-secondary">Spiel abbrechen</button>
            </div>
        </div>
    );
}

export default GameTable;