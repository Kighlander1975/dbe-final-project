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
    const [gameHistoryCollapsed, setGameHistoryCollapsed] = useState(true);

    useEffect(() => {
        const loadGameData = async () => {
            try {
                console.log('Loading game data for ID:', id);
                const response = await gameAPI.getGame(id);
                console.log('Game data loaded:', response);
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

    const processGameData = (data) => {
        if (!data) return null;

        console.log('Processing game data:', data);

        // Parse game name: "Mein Spiel_1765705880_3ac8aa1c"
        const rawGameName = data.gameName || 'Unbekanntes Spiel';
        const nameParts = rawGameName.split('_');
        
        let gameName = 'Unbekanntes Spiel';
        let timestamp = null;
        let uuid = null;
        
        if (nameParts.length >= 3) {
            gameName = nameParts[0];
            timestamp = parseInt(nameParts[1]);
            uuid = nameParts[2];
        } else if (nameParts.length === 1) {
            gameName = nameParts[0];
        }

        // Convert UNIX timestamp to MEZ date
        let formattedDate = 'Unbekannt';
        if (timestamp) {
            const date = new Date(timestamp * 1000);
            formattedDate = date.toLocaleDateString('de-DE', {
                timeZone: 'Europe/Berlin',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        }

        const playersCount = data.players?.length || 0;
        const roundsPlayed = data.rounds?.length || 0;
        const victoryCondition = data.victoryCondition || 0;

        // Funktion zur Berechnung der Punkte für eine Runde (aus GameTable.jsx übernommen)
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

        // Runden-Daten verarbeiten
        const roundsDetails = data.rounds?.map(round => ({
            round: round.round || 0,
            bids: round.bids || {},
            tricks: round.tricks || {},
            points: calculateRoundPoints(round.bids || [], round.tricks || [])
        })) || [];

        // Spieler mit berechneten Gesamtpunkten
        const players = data.players?.map(player => {
            // Gesamtpunkte aus allen Runden berechnen
            let calculatedTotalPoints = 0;
            roundsDetails.forEach(round => {
                const playerIndex = data.players.findIndex(p => p.id === player.id);
                if (playerIndex !== -1 && round.points && round.points[playerIndex] !== undefined) {
                    calculatedTotalPoints += round.points[playerIndex];
                }
            });

            return {
                name: player.name || 'Unbekannter Spieler',
                userId: player.user_id,
                email: player.email, // Für zukünftige Implementierung
                totalPoints: calculatedTotalPoints,
                rank: player.rank || 0
            };
        }) || [];

        // Ränge neu berechnen basierend auf den berechneten Punkten
        const calculateRanking = (players) => {
            // Erstelle Kopie mit ursprünglicher Index
            const playersWithIndex = players.map((p, i) => ({ ...p, originalIndex: i }));
            
            // Sortiere nach Punkten absteigend
            playersWithIndex.sort((a, b) => b.totalPoints - a.totalPoints);
            
            // Weise Ränge zu (mit übersprungenen Rängen bei Gleichstand)
            let currentRank = 1;
            for (let i = 0; i < playersWithIndex.length; i++) {
                if (i > 0 && playersWithIndex[i].totalPoints < playersWithIndex[i - 1].totalPoints) {
                    currentRank = i + 1;
                }
                playersWithIndex[i].rank = currentRank;
            }
            
            // Sortierte Reihenfolge beibehalten (nach Rang)
            return playersWithIndex;
        };

        // Ränge neu berechnen
        const playersWithCorrectRanking = calculateRanking(players);

        return {
            gameDetails: {
                gameName,
                timestamp: formattedDate,
                uuid,
                playersCount,
                roundsPlayed,
                victoryCondition
            },
            players: playersWithCorrectRanking,
            roundsDetails
        };
    };

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

    const processedData = processGameData(gameData);
    console.log('Processed data:', processedData);

    // Hilfsfunktion für Spieler-Status Icon und Tooltip
    const getPlayerStatusIcon = (player) => {
        if (player.rank === 1) {
            return {
                icon: '🏆',
                tooltip: 'Gewinner - wird in das ALLTIME RANKING aufgenommen und erhält einen Ehrenplatz'
            };
        } else if (player.userId) {
            return {
                icon: '⭐',
                tooltip: 'Spiel wird gewertet und in die ALLTIME RANKING Tabelle aufgenommen'
            };
        } else {
            return {
                icon: '❓',
                tooltip: 'Spiel wird für diesen Spieler nicht gewertet, aber die Position wirkt sich auf registrierte Spieler aus'
            };
        }
    };

    try {
        return (
            <div className="game">
                <div className="game__content">
                    <div className="game__header">
                        <h1 className="game__title">📊 Spiel-Auswertung</h1>
                        <p className="game__subtitle">
                            Vollständige Spieldaten für {processedData?.gameDetails?.gameName || 'Unbekanntes Spiel'}
                        </p>
                    </div>

                    <div className="game-evaluation">
                        {/* Game Details */}
                        <div className="game-evaluation__section">
                            <h2>🎯 Spiel-Details</h2>
                            <div className="game-details">
                                <div className="game-detail-item">
                                    <span className="game-detail-label">Spielname:</span>
                                    <span className="game-detail-value">{processedData?.gameDetails?.gameName}</span>
                                </div>
                                <div className="game-detail-item">
                                    <span className="game-detail-label">Datum:</span>
                                    <span className="game-detail-value">{processedData?.gameDetails?.timestamp}</span>
                                </div>
                                <div className="game-detail-item">
                                    <span className="game-detail-label">UUID:</span>
                                    <span className="game-detail-value">{processedData?.gameDetails?.uuid}</span>
                                </div>
                                <div className="game-detail-item">
                                    <span className="game-detail-label">Spieler:</span>
                                    <span className="game-detail-value">{processedData?.gameDetails?.playersCount}</span>
                                </div>
                                <div className="game-detail-item">
                                    <span className="game-detail-label">Runden gespielt:</span>
                                    <span className="game-detail-value">{processedData?.gameDetails?.roundsPlayed}</span>
                                </div>
                                <div className="game-detail-item">
                                    <span className="game-detail-label">Siegbedingung:</span>
                                    <span className="game-detail-value">{processedData?.gameDetails?.victoryCondition} Punkte</span>
                                </div>
                            </div>
                        </div>

                        {/* Players */}
                        <div className="game-evaluation__section">
                            <h2>🏆 Spieler & Ergebnisse</h2>
                            
                            {/* Top 3 Winner Cards */}
                            <div className="winners-cards">
                                {processedData?.players?.slice(0, 3).map((player, index) => (
                                    <div key={index} className={`winner-card winner-card--${index + 1}`}>
                                        <span 
                                            className="player-status-icon" 
                                            title={getPlayerStatusIcon(player).tooltip}
                                        >
                                            {getPlayerStatusIcon(player).icon}
                                        </span>
                                        <div className="winner-card__rank">
                                            {index === 0 && '🥇'}
                                            {index === 1 && '🥈'}
                                            {index === 2 && '🥉'}
                                        </div>
                                        <div className="winner-card__content">
                                            <h3 className="winner-card__name">{player.name}</h3>
                                            <div className="winner-card__stats">
                                                <div className="winner-card__points">
                                                    <span className="points-label">Punkte:</span>
                                                    <span className="points-value">{player.totalPoints}</span>
                                                </div>
                                                {player.userId && (
                                                    <div className="winner-card__userid">
                                                        User ID: {player.userId}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Full Players Table (only if more than 3 players) */}
                            {processedData?.players && processedData.players.length > 3 && (
                                <div className="players-table-container">
                                    <h3>📋 Vollständige Rangliste</h3>
                                    <table className="players-table">
                                        <thead>
                                            <tr>
                                                <th>Rang</th>
                                                <th>Spieler</th>
                                                <th>Punkte</th>
                                                <th>User ID</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {processedData.players.map((player, index) => (
                                                <tr key={index} className={index < 3 ? 'top-three' : ''}>
                                                    <td className="rank-cell">
                                                        {index === 0 && '🥇'}
                                                        {index === 1 && '🥈'}
                                                        {index === 2 && '🥉'}
                                                        {index > 2 && `#${player.rank}`}
                                                    </td>
                                                    <td className="name-cell">
                                                        <span 
                                                            className="player-status-icon table-icon" 
                                                            title={getPlayerStatusIcon(player).tooltip}
                                                        >
                                                            {getPlayerStatusIcon(player).icon}
                                                        </span>
                                                        {player.name}
                                                    </td>
                                                    <td className="points-cell">{player.totalPoints}</td>
                                                    <td className="userid-cell">{player.userId || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Rounds Table - Collapsible */}
                        <div className="game-evaluation__section">
                            <div 
                                className="collapsible-header"
                                onClick={() => setGameHistoryCollapsed(!gameHistoryCollapsed)}
                            >
                                <h2>🎲 Spiel-Verlauf</h2>
                                <span className={`collapse-icon ${gameHistoryCollapsed ? 'collapsed' : 'expanded'}`}>
                                    {gameHistoryCollapsed ? '▶' : '▼'}
                                </span>
                            </div>
                            
                            {!gameHistoryCollapsed && (
                                <div className="rounds-table-container">
                                    <table className="rounds-table">
                                        <thead>
                                            <tr>
                                                <th className="player-column">Spieler</th>
                                                {processedData?.roundsDetails?.map((round, index) => (
                                                    <th key={`round-${round.round}`} className="round-group-column" colSpan="2">
                                                        Runde {round.round}
                                                    </th>
                                                ))}
                                                <th className="result-group-column" colSpan="2">
                                                    Ergebnis
                                                </th>
                                            </tr>
                                            <tr className="sub-header">
                                                <th className="player-column sub-header-cell"></th>
                                                {processedData?.roundsDetails?.map((round, index) => (
                                                    <React.Fragment key={`sub-round-${round.round}`}>
                                                        <th className="round-sub-column">Ans.</th>
                                                        <th className="round-sub-column">Erg.</th>
                                                    </React.Fragment>
                                                ))}
                                                <th className="result-sub-column">Punkte</th>
                                                <th className="result-sub-column">Rang</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {processedData?.players?.map((player, playerIndex) => (
                                                <tr key={playerIndex}>
                                                    <td className="player-column player-name-cell">
                                                        <span 
                                                            className="player-status-icon table-icon" 
                                                            title={getPlayerStatusIcon(player).tooltip}
                                                        >
                                                            {getPlayerStatusIcon(player).icon}
                                                        </span>
                                                        {player.name}
                                                    </td>
                                                    {processedData?.roundsDetails?.map((round, roundIndex) => (
                                                        <React.Fragment key={`player-${playerIndex}-round-${round.round}`}>
                                                            <td className="round-sub-column">
                                                                {round.bids && round.bids[playerIndex] !== undefined ? round.bids[playerIndex] : '-'}
                                                            </td>
                                                            <td className="round-sub-column">
                                                                {round.tricks && round.tricks[playerIndex] !== undefined ? round.tricks[playerIndex] : '-'}
                                                            </td>
                                                        </React.Fragment>
                                                    ))}
                                                    <td className="result-sub-column">{player.totalPoints}</td>
                                                    <td className="result-sub-column">{player.rank}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
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
    } catch (renderError) {
        console.error('Render error:', renderError);
        return (
            <div className="game">
                <div className="game__content">
                    <div className="error-state">
                        <p>❌ Fehler beim Rendern der Seite: {renderError.message}</p>
                        <p>Spiel-ID: {id}</p>
                        <p>GameData: {JSON.stringify(gameData)}</p>
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
}

export default GameEvaluation;
