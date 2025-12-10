// src/pages/Game.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GameTable from '../components/GameTable';
import '../styles/pages/game.css';

function Game() {
    const location = useLocation();
    const navigate = useNavigate();

    // Daten aus Navigation State holen (von GameSummary)
    const gameData = location.state;

    // Fallback: Wenn keine Daten vorhanden, zurück zur Übersicht
    useEffect(() => {
        if (!gameData) {
            console.warn('Keine Spieldaten gefunden, leite zurück zur Übersicht');
            navigate('/game-summary');
        }
    }, [gameData, navigate]);

    if (!gameData) {
        return (
            <div className="game">
                <div className="loading-state">
                    <p>🔄 Lade Spiel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="game">
            <div className="game__container">
                <GameTable gameData={gameData} />
            </div>
        </div>
    );
}

export default Game;