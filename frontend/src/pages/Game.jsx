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

    return (
        <div className="game-container">
            <GameTable gameData={gameData} />
        </div>
    );
}

export default Game;