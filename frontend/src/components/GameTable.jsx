// src/components/GameTable.jsx
import React, { useState, useRef, useEffect } from 'react';
import RoundHeader from './rounds/RoundHeader';
import RoundData from './rounds/RoundData';
import './GameTable.css';

// Funktion zum Generieren zufälliger Bids (0-7)
const generateBids = (numPlayers) => {
    return Array.from({ length: numPlayers }, () => Math.floor(Math.random() * 8));
};

// Funktion zum Generieren von Tricks, deren Summe 7 ergibt (jeder 0-7)
const generateTricks = (numPlayers) => {
    let tricks;
    do {
        tricks = Array.from({ length: numPlayers }, () => Math.floor(Math.random() * 8));
    } while (tricks.reduce((sum, val) => sum + val, 0) !== 7);
    return tricks;
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

function GameTable({ gameData: initialGameData }) {
    const tableRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);

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
    // Konvertiere initialGameData in internes Format
    const convertGameData = (data) => {
        if (!data) return null;

        let players = data.players.map((player, index) => ({
            id: player.id || index + 1,
            name: player.name,
            totalPoints: 0,
            rank: 0,
        }));

        // NICHT auf 11 Spieler auffüllen - verwende nur die echten Spieler

        // Erste Runde ohne Daten hinzufügen
        const numPlayers = players.length;
        const firstRound = {
            round: 1,
            bids: Array(numPlayers).fill(0),
            tricks: Array(numPlayers).fill(0),
            points: Array(numPlayers).fill(0),
        };

        return {
            gameName: data.gameName,
            players: players,
            rounds: [firstRound],
            currentRound: 1,
            gameStatus: "active",
            victoryCondition: data.victoryPoints || 100,
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
        };
    });

    // Update gameData wenn initialGameData sich ändert
    useEffect(() => {
        const converted = convertGameData(initialGameData);
        if (converted) {
            setGameData(converted);
        }
    }, [initialGameData]);

    // Funktion zum Berechnen der Gesamtpunkte und Ränge
    const calculateTotals = () => {
        // Berechne totalPoints für jeden Spieler
        const playersWithTotals = gameData.players.map((player) => {
            const totalPoints = gameData.rounds.reduce((sum, round) => {
                const playerIndex = gameData.players.findIndex(
                    (p) => p.id === player.id
                );
                return sum + (round.points[playerIndex] || 0);
            }, 0);

            return { ...player, totalPoints };
        });

        // Berechne Ränge basierend auf totalPoints (höhere Punkte = besserer Rang)
        const sortedPlayers = [...playersWithTotals].sort(
            (a, b) => b.totalPoints - a.totalPoints
        );
        sortedPlayers.forEach((player, index) => {
            const originalPlayer = playersWithTotals.find(
                (p) => p.id === player.id
            );
            originalPlayer.rank = index + 1;
        });

        // Gib die Spieler in ursprünglicher Reihenfolge zurück
        return playersWithTotals;
    };

    const currentTotals = calculateTotals();

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
                    <h2>{gameData.gameName || "Spiel-Tabelle"}</h2>
                    <div className="game-table__info">
                        <span>Aktuelle Runde: {gameData.currentRound}</span>
                        <span>Status: {gameData.gameStatus}</span>
                        <span>Siegbedingung: {gameData.victoryCondition}</span>
                    </div>
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
                        <div className="game-table__player-cell">
                            {player.name}
                        </div>
                        <div className="game-table__rounds-container">
                            {gameData.rounds.map(r => (
                                <RoundData key={r.round} bid={r.bids[playerIndex]} tricks={r.tricks[playerIndex]} />
                            ))}
                        </div>
                        <div className="game-table__stats-container">
                            <div className="game-table__points-cell">
                                {player.totalPoints > 0
                                    ? player.totalPoints
                                    : "-"}
                            </div>
                            <div className="game-table__rank-cell">
                                {player.rank > 0 ? player.rank : "-"}
                            </div>
                        </div>
                    </div>
                ))}
                </div>

                <div className="game-table__actions">
                    <button className="btn btn-primary">Eingaben bestätigen</button>
                    <button className="btn btn-secondary">Spiel abbrechen</button>
                </div>
            </div>
        </div>
    );
}export default GameTable;
