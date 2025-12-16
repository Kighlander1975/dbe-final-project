// src/pages/Game.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import GameTable from '../components/GameTable';
import '../styles/pages/game.css';
import { gameAPI } from '../services/api';

function Game() {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams(); // ⭐ Game ID aus URL-Parameter

    const [gameData, setGameData] = useState(null);
    const [gameId, setGameId] = useState(null);
    const [isInitialized, setIsInitialized] = useState(() => {
        // Bei neuem Laden der Game-Seite sessionStorage zurücksetzen
        sessionStorage.removeItem('gameInitialized');
        return false;
    });

    useEffect(() => {
        if (isInitialized) return; // Verhindere mehrfache Ausführung

        const initGame = async () => {
            // ⭐ Verwende URL-Parameter als primäre Quelle
            const gameIdFromParams = id;
            const stateData = location.state;
            
            // Prüfe auch Query-Parameter als Fallback
            const urlParams = new URLSearchParams(location.search);
            const gameIdFromUrl = urlParams.get('gameId');
            
            const finalGameId = gameIdFromParams || stateData?.gameId || gameIdFromUrl;
            
            if (finalGameId) {
                try {
                    const response = await gameAPI.getGame(finalGameId);
                    setGameData(response.game_data);
                    setGameId(response.id);
                    localStorage.setItem('currentGameId', response.id);
                    sessionStorage.setItem('gameInitialized', 'true');
                    setIsInitialized(true);
                } catch (error) {
                    localStorage.removeItem('currentGameId');
                    sessionStorage.removeItem('gameInitialized');
                    navigate('/new-game');
                }
            } else if (stateData) {
                // Legacy: Spiel erstellen (für alte Flows)
                try {
                    const response = await gameAPI.createGame(stateData);
                    setGameData(response.game_data);
                    setGameId(response.id);
                    localStorage.setItem('currentGameId', response.id);
                    sessionStorage.setItem('gameInitialized', 'true');
                    setIsInitialized(true);
                } catch (error) {
                    console.error('❌ Fehler beim Erstellen des Spiels:', error);
                    navigate('/new-game');
                }
            } else {
                // Bei Refresh: Spiel aus API laden
                const savedGameId = localStorage.getItem('currentGameId');
                if (savedGameId) {
                    try {
                        const response = await gameAPI.getGame(savedGameId);
                        setGameData(response.game_data);
                        setGameId(response.id);
                        sessionStorage.setItem('gameInitialized', 'true');
                        setIsInitialized(true);
                    } catch (error) {
                        console.error('❌ Fehler beim Laden des Spiels:', error);
                        localStorage.removeItem('currentGameId');
                        sessionStorage.removeItem('gameInitialized');
                        navigate('/new-game');
                    }
                } else {
                    navigate('/new-game');
                }
            }
        };
        initGame();
    }, []); // Leere Dependency-Array - nur einmal ausführen

    const handleGameUpdate = async (updatedGameData) => {
        if (gameId) {
            try {
                await gameAPI.updateGame(gameId, updatedGameData);
            } catch (error) {
                console.error('❌ Fehler beim Speichern des Spiels:', error);
            }
        } else {
            console.warn('⚠️ Kein gameId für Update');
        }
    };

    if (!gameData) return <div>Lade Spiel...</div>;

    return (
        <div className="game-container">
            <GameTable gameData={gameData} gameId={gameId} onGameUpdate={handleGameUpdate} />
        </div>
    );
}

export default Game;