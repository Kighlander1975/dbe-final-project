import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { rankingAPI } from '../services/api';
import './Rankings.css';

function PlayerDetails() {
    const { userId } = useParams();
    const { user } = useAuth();
    const [playerStats, setPlayerStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPlayerStats();
    }, [userId]);

    const fetchPlayerStats = async () => {
        try {
            const response = await rankingAPI.getUserRanking(userId);
            setPlayerStats(response);
        } catch (err) {
            console.error('Error fetching player stats:', err);
            setError('Fehler beim Laden der Spieler-Statistiken');
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    if (loading) {
        return (
            <div className="rankings-page">
                <div className="loading">🏆 Lade Spieler-Details...</div>
            </div>
        );
    }

    if (error || !playerStats) {
        return (
            <div className="rankings-page">
                <div className="error-message">
                    {error || 'Spieler nicht gefunden'}
                </div>
                <Link to="/rankings" className="btn btn-primary">
                    ← Zurück zu Rankings
                </Link>
            </div>
        );
    }

    const { user: player, statistics, recent_games, placement_distribution } = playerStats;

    return (
        <div className="rankings-page">
            <div className="rankings-header">
                <h1>👤 {player.name}</h1>
                <p>Spieler-Statistiken und Details</p>
            </div>

            {/* Übersicht-Karten */}
            <div className="rankings-overview">
                <div className="overview-card">
                    <h3>{player.total_ranking_points}</h3>
                    <p>Gesamt-Punkte</p>
                </div>
                <div className="overview-card">
                    <h3>{player.games_played}</h3>
                    <p>Gespielte Spiele</p>
                </div>
                <div className="overview-card">
                    <h3>{player.current_rating}</h3>
                    <p>Aktuelles Rating</p>
                </div>
                <div className="overview-card">
                    <h3>{getRankIcon(player.best_placement)} {player.best_placement}</h3>
                    <p>Beste Platzierung</p>
                </div>
            </div>

            {/* Detaillierte Statistiken */}
            <div className="player-details-section">
                <h2>📊 Detaillierte Statistiken</h2>
                <div className="stats-grid">
                    <div className="stat-item">
                        <strong>Durchschnitts-Platzierung:</strong>
                        <span>{statistics.average_placement || 'N/A'}</span>
                    </div>
                    <div className="stat-item">
                        <strong>Siegesrate:</strong>
                        <span>{statistics.win_rate}%</span>
                    </div>
                    <div className="stat-item">
                        <strong>Mitglied seit:</strong>
                        <span>{new Date(player.member_since).toLocaleDateString('de-DE')}</span>
                    </div>
                    <div className="stat-item">
                        <strong>Gewertete Spiele:</strong>
                        <span>{statistics.total_games_ranked}</span>
                    </div>
                </div>
            </div>

            {/* Platzierungs-Verteilung */}
            {Object.keys(placement_distribution).length > 0 && (
                <div className="player-details-section">
                    <h2>📈 Platzierungs-Verteilung</h2>
                    <div className="placement-distribution">
                        {Object.entries(placement_distribution)
                            .sort(([a], [b]) => parseInt(a) - parseInt(b))
                            .map(([placement, count]) => (
                                <div key={placement} className="placement-bar">
                                    <div className="placement-label">
                                        {getRankIcon(parseInt(placement))} Platz {placement}
                                    </div>
                                    <div className="placement-count">{count}x</div>
                                    <div
                                        className="placement-fill"
                                        style={{
                                            width: `${(count / Object.values(placement_distribution).reduce((a, b) => a + b, 0)) * 100}%`
                                        }}
                                    ></div>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Letzte Spiele */}
            {recent_games.length > 0 && (
                <div className="player-details-section">
                    <h2>🎮 Letzte Spiele</h2>
                    <div className="recent-games-table">
                        <div className="rankings-table-header">
                            <div className="date-col">Datum</div>
                            <div className="game-col">Spiel</div>
                            <div className="rank-col">Platz</div>
                            <div className="points-col">Punkte</div>
                            <div className="players-col">Spieler</div>
                        </div>
                        {recent_games.map((game, index) => (
                            <div key={index} className="rankings-row">
                                <div className="date-col">
                                    {new Date(game.date).toLocaleDateString('de-DE')}
                                </div>
                                <div className="game-col">
                                    {game.game_name}
                                </div>
                                <div className="rank-col">
                                    {getRankIcon(game.rank)}
                                </div>
                                <div className="points-col">
                                    +{game.points_earned}
                                </div>
                                <div className="players-col">
                                    {game.player_count}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Navigation */}
            <div className="player-details-actions">
                <Link to="/rankings" className="btn btn-primary">
                    ← Zurück zu Rankings
                </Link>
                {user && user.id === parseInt(userId) && (
                    <Link to="/change-password" className="btn btn-outline">
                        Passwort ändern
                    </Link>
                )}
            </div>
        </div>
    );
}

export default PlayerDetails;