// src/pages/GameEvaluation.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gameAPI } from '../services/api';
import '../styles/pages/game.css';

function GameEvaluation() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [gameData, setGameData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadGameData = async () => {
            try {
                const response = await gameAPI.getGame(id);
                setGameData(response.game_data);
                setLoading(false);
            } catch (err) {
                console.error('Error loading game data:', err);
                setError('Fehler beim Laden der Spieldaten');
                setLoading(false);
            }
        };

        if (id) {
            loadGameData();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="game">
                <div className="game__content">
                    <div className="loading-state">
                        <p>⏳ Lade Spieldaten...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="game">
                <div className="game__content">
                    <div className="error-state">
                        <p>❌ {error}</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/')}
                        >
                            Zurück zur Startseite
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="game">
            <div className="game__content">
                <div className="game__header">
                    <h1 className="game__title">📊 Spiel-Auswertung</h1>
                    <p className="game__subtitle">
                        Vollständige Spieldaten für {gameData?.gameName?.split('_')[0] || 'Unbekanntes Spiel'}
                    </p>
                </div>

                <div className="game-evaluation">
                    <div className="game-evaluation__content">
                        <h2>JSON-Daten der Partie:</h2>
                        <pre className="game-evaluation__json">
                            {JSON.stringify(gameData, null, 2)}
                        </pre>
                    </div>

                    <div className="game-evaluation__actions">
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate('/')}
                        >
                            ← Zurück zur Startseite
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate(`/game/${id}`)}
                        >
                            Zurück zum Spiel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GameEvaluation;