// src/pages/Game.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GameTable from '../components/GameTable';
import '../styles/pages/game.css';

function Game() {
    const location = useLocation();
    const navigate = useNavigate();

    // Daten aus Navigation State holen (von GameSummary) oder aus localStorage
    const [gameData, setGameData] = useState(() => {
        const stateData = location.state;
        if (stateData) {
            // Speichere in sessionStorage
            sessionStorage.setItem('gameData', JSON.stringify(stateData));
            sessionStorage.setItem('gameActive', 'true');
            return stateData;
        } else {
            // Bei Refresh: Zurück zu NewGame, um Datenverlust zu vermeiden
            sessionStorage.removeItem('gameData');
            sessionStorage.removeItem('gameActive');
            navigate('/new-game');
            return null;
        }
    });

    // Spiel aktiv setzen beim Mount
    useEffect(() => {
        localStorage.setItem('gameActive', 'true');
        return () => {
            // Optional: beim Unmount deaktivieren, aber besser manuell
        };
    }, []);

    if (!gameData) return null;

    return (
        <div className="game-container">
            <GameTable gameData={gameData} />
        </div>
    );
}

export default Game;