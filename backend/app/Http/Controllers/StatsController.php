<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HostRequest;

class StatsController extends Controller
{
    /**
     * Get overall player statistics.
     */
    public function players()
    {
        return Cache::remember('stats.players', 3600, function () { // 1h Cache
            $stats = [];

            // Alle beendeten Spiele holen
            $finishedGames = Game::where('status', 'finished')->get();

            foreach ($finishedGames as $game) {
                $gameData = $game->game_data;

                if (isset($gameData['players'])) {
                    foreach ($gameData['players'] as $player) {
                        $playerId = $player['id'] ?? null;
                        if (!$playerId) continue;

                        if (!isset($stats[$playerId])) {
                            $stats[$playerId] = [
                                'id' => $playerId,
                                'name' => $player['name'] ?? 'Unknown',
                                'totalGames' => 0,
                                'totalWins' => 0,
                                'totalPoints' => 0,
                                'averagePoints' => 0,
                            ];
                        }

                        $stats[$playerId]['totalGames']++;
                        $stats[$playerId]['totalPoints'] += $player['totalPoints'] ?? 0;

                        // Sieg: Höchste Punkte im Spiel
                        $maxPoints = max(array_column($gameData['players'], 'totalPoints'));
                        if (($player['totalPoints'] ?? 0) === $maxPoints) {
                            $stats[$playerId]['totalWins']++;
                        }
                    }
                }
            }

            // Durchschnitt berechnen
            foreach ($stats as &$stat) {
                $stat['averagePoints'] = $stat['totalGames'] > 0 ? round($stat['totalPoints'] / $stat['totalGames'], 2) : 0;
            }

            return response()->json(array_values($stats));
        });
    }

    /**
     * Get statistics for a specific player.
     */
    public function player(string $id)
    {
        $cacheKey = "stats.player.{$id}";
        return Cache::remember($cacheKey, 3600, function () use ($id) {
            $stats = [
                'id' => $id,
                'name' => 'Unknown',
                'totalGames' => 0,
                'totalWins' => 0,
                'totalPoints' => 0,
                'averagePoints' => 0,
                'recentGames' => [],
            ];

            // Alle beendeten Spiele des Spielers
            $games = Game::where('status', 'finished')
                ->whereJsonContains('game_data->players', [['id' => (int)$id]])
                ->orderBy('updated_at', 'desc')
                ->limit(10) // Letzte 10 Spiele
                ->get();

            foreach ($games as $game) {
                $gameData = $game->game_data;

                if (isset($gameData['players'])) {
                    foreach ($gameData['players'] as $player) {
                        if (($player['id'] ?? null) == $id) {
                            $stats['name'] = $player['name'] ?? 'Unknown';
                            $stats['totalGames']++;
                            $stats['totalPoints'] += $player['totalPoints'] ?? 0;

                            // Sieg prüfen
                            $maxPoints = max(array_column($gameData['players'], 'totalPoints'));
                            if (($player['totalPoints'] ?? 0) === $maxPoints) {
                                $stats['totalWins']++;
                            }

                            // Recent game
                            $stats['recentGames'][] = [
                                'gameId' => $game->id,
                                'gameName' => $gameData['gameName'] ?? 'Unnamed',
                                'points' => $player['totalPoints'] ?? 0,
                                'rank' => $this->calculateRank($gameData['players'], $player['totalPoints'] ?? 0),
                                'playedAt' => $game->updated_at->toISOString(),
                            ];
                        }
                    }
                }
            }

            $stats['averagePoints'] = $stats['totalGames'] > 0 ? round($stats['totalPoints'] / $stats['totalGames'], 2) : 0;

            return response()->json($stats);
        });
    }

    /**
     * Helper: Calculate rank in a game.
     */
    private function calculateRank(array $players, int $points): int
    {
        $sortedPoints = array_column($players, 'totalPoints');
        rsort($sortedPoints);
        $rank = array_search($points, $sortedPoints) + 1;
        return $rank;
    }

    /**
     * Get admin statistics.
     */
    public function adminStats()
    {
        return Cache::remember('admin.stats', 300, function () { // 5min Cache
            return [
                'users' => User::count(),
                'active_games' => Game::where('status', 'active')->count(),
                'paused_games' => Game::where('status', 'paused')->count(),
                'finished_games' => Game::where('status', 'finished')->count(),
                'host_requests_total' => HostRequest::count(),
                'host_requests_unseen' => HostRequest::whereNull('seen_at')->count(),
            ];
        });
    }
}
