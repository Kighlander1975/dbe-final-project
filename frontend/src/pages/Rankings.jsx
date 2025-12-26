import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { rankingAPI, publicAPI } from '../services/api';
import './Rankings.css';

function Rankings() {
    const { user } = useAuth();
    const [rankings, setRankings] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [animatedStats, setAnimatedStats] = useState({
        total_ranked_players: 0,
        total_ranked_games: 0,
        total_points_awarded: 0,
        average_points_per_player: 0,
    });

    const [countUpDuration, setCountUpDuration] = useState(2000); // Default 2 seconds
    const [durationLoaded, setDurationLoaded] = useState(false);

    useEffect(() => {
        fetchRankings();
        fetchStats();
        fetchCountUpDuration();
    }, []);

    useEffect(() => {
        if (stats && durationLoaded) {
            animateCounters(stats.overview);
        }
    }, [stats, durationLoaded]);

    const fetchRankings = async () => {
        try {
            const response = await rankingAPI.getRankings();
            setRankings(response.rankings);
        } catch (err) {
            console.error('Error fetching rankings:', err);
            setError('Fehler beim Laden der Rankings');
        }
    };

    const fetchStats = async () => {
        try {
            const response = await rankingAPI.getRankingStats();
            setStats(response);
            // animateCounters(response.overview); // Remove this
        } catch (err) {
            console.error('Error fetching ranking stats:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCountUpDuration = async () => {
        try {
            const response = await publicAPI.getCountUpDuration();
            const duration = parseFloat(response.setting.value) * 1000;
            setCountUpDuration(duration); // Convert to milliseconds
            setDurationLoaded(true);
        } catch (err) {
            console.error('Error fetching count-up duration:', err);
            setCountUpDuration(2000); // Fallback to 2 seconds
            setDurationLoaded(true);
        }
    };

    // Animate counters from 0 to target value
    const animateCounters = (targetStats) => {
        const duration = countUpDuration;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            setAnimatedStats({
                total_ranked_players: Math.floor(targetStats.total_ranked_players * progress),
                total_ranked_games: Math.floor(targetStats.total_ranked_games * progress),
                total_points_awarded: Math.floor(targetStats.total_points_awarded * progress),
                average_points_per_player: Math.floor(targetStats.average_points_per_player * progress),
            });

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Ensure final values are exact
                setAnimatedStats(targetStats);
            }
        };

        requestAnimationFrame(animate);
    };

    const getRankIcon = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    const getPlacementColor = (placement) => {
        if (placement === 1) return 'placement-gold';
        if (placement === 2) return 'placement-silver';
        if (placement === 3) return 'placement-bronze';
        return 'placement-normal';
    };

    if (loading) {
        return (
            <div className="rankings-page">
                <div className="loading">🏆 Lade Rankings...</div>
            </div>
        );
    }

    return (
        <div className="rankings-page">
            <div className="rankings-header">
                <h1>🏆 Spieler-Rankings</h1>
                <p>Die besten Spieler nach Gesamtpunkten</p>
            </div>

            {stats && (
                <div className="rankings-overview">
                    <div className="overview-card">
                        <h3>{animatedStats.total_ranked_players}</h3>
                        <p>Registrierte User</p>
                    </div>
                    <div className="overview-card">
                        <h3>{animatedStats.total_ranked_games}</h3>
                        <p>Gespielte Spiele</p>
                    </div>
                    <div className="overview-card">
                        <h3>{animatedStats.total_points_awarded}</h3>
                        <p>Vergebene Punkte</p>
                    </div>
                    <div className="overview-card">
                        <h3>{animatedStats.average_points_per_player}</h3>
                        <p>Ø Punkte pro Spieler</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="rankings-table">
                <div className="rankings-table-header">
                    <div className="rank-col">Rang</div>
                    <div className="player-col">Spieler</div>
                    <div className="points-col">Punkte</div>
                    <div className="games-col">Spiele</div>
                    <div className="best-col">Beste Platzierung</div>
                    <div className="rating-col">Rating</div>
                    <div className="actions-col"></div>
                </div>

                {rankings.map((player) => (
                    <div key={player.id} className={`rankings-row ${player.id === user?.id ? 'current-user' : ''}`}>
                        <div className="rank-col">
                            <span className="rank-icon">{getRankIcon(player.rank)}</span>
                        </div>
                        <div className="player-col">
                            <span className="player-name">{player.name}</span>
                            {player.id === user?.id && <span className="current-user-badge">(Du)</span>}
                        </div>
                        <div className="points-col">
                            <strong>{player.total_ranking_points}</strong>
                        </div>
                        <div className="games-col">
                            {player.games_played}
                        </div>
                        <div className="best-col">
                            <span className={`placement-badge ${getPlacementColor(player.best_placement)}`}>
                                {player.best_placement === 1 ? '🥇' :
                                 player.best_placement === 2 ? '🥈' :
                                 player.best_placement === 3 ? '🥉' :
                                 `#${player.best_placement}`}
                            </span>
                        </div>
                        <div className="rating-col">
                            {player.current_rating}
                        </div>
                        <div className="actions-col">
                            <Link
                                to={`/rankings/${player.id}`}
                                className="btn btn-secondary btn-sm"
                            >
                                Details
                            </Link>
                        </div>
                    </div>
                ))}

                {rankings.length === 0 && !error && (
                    <div className="no-rankings">
                        <p>🏆 Noch keine Rankings verfügbar</p>
                        <p>Spiele dein erstes Spiel, um in die Rankings zu kommen!</p>
                    </div>
                )}
            </div>

            <div className="rankings-info">
                <h3>📊 Wie funktioniert das Ranking-System?</h3>
                <ul>
                    <li><strong>Punkte:</strong> Werden nach Spieleranzahl und Platzierung vergeben</li>
                    <li><strong>Rating:</strong> Elo-ähnliches System für faire Vergleiche</li>
                    <li><strong>Nur registrierte Spieler</strong> sammeln Punkte (Gäste nicht)</li>
                    <li><strong>Platzierungen:</strong> 1. Platz bekommt die meisten Punkte</li>
                </ul>
            </div>
        </div>
    );
}

export default Rankings;