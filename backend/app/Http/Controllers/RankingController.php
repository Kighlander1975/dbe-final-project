<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class RankingController extends Controller
{
    /**
     * Get top rankings (all-time)
     */
    public function index(Request $request)
    {
        $limit = $request->get('limit', 50);
        $offset = $request->get('offset', 0);

        $rankings = User::select([
                'id',
                'name',
                'total_ranking_points',
                'games_played',
                'best_placement',
                'current_rating'
            ])
            ->where('total_ranking_points', '>', 0)
            ->orderBy('total_ranking_points', 'desc')
            ->orderBy('games_played', 'asc') // Bei Punktgleichstand: mehr Spiele = höher gewertet
            ->limit($limit)
            ->offset($offset)
            ->get();

        // Berechne Rang-Positionen
        $rankings->transform(function ($user, $index) use ($offset) {
            $user->rank = $offset + $index + 1;
            return $user;
        });

        return response()->json([
            'rankings' => $rankings,
            'total' => User::where('total_ranking_points', '>', 0)->count(),
            'limit' => $limit,
            'offset' => $offset
        ]);
    }

    /**
     * Get detailed stats for a specific user
     */
    public function show(Request $request, $userId)
    {
        $user = User::findOrFail($userId);

        // Persönliche Statistiken
        $personalStats = [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'total_ranking_points' => $user->total_ranking_points,
                'games_played' => $user->games_played,
                'best_placement' => $user->best_placement,
                'current_rating' => $user->current_rating,
                'member_since' => $user->created_at
            ]
        ];

        // Berechne Durchschnitts-Platzierung
        $avgPlacement = DB::table('player_rankings')
            ->where('user_id', $userId)
            ->avg('final_rank');

        $personalStats['statistics'] = [
            'average_placement' => $avgPlacement ? round($avgPlacement, 2) : null,
            'total_games_ranked' => DB::table('player_rankings')->where('user_id', $userId)->count(),
            'win_rate' => $user->games_played > 0 ?
                round((DB::table('player_rankings')->where('user_id', $userId)->where('final_rank', 1)->count() / $user->games_played) * 100, 1) : 0
        ];

        // Letzte 10 Spiele
        $recentGames = DB::table('player_rankings')
            ->join('games', 'player_rankings.game_id', '=', 'games.id')
            ->where('player_rankings.user_id', $userId)
            ->select([
                'player_rankings.final_rank',
                'player_rankings.points_earned',
                'player_rankings.player_count',
                'games.game_data->gameName as game_name',
                'player_rankings.created_at'
            ])
            ->orderBy('player_rankings.created_at', 'desc')
            ->limit(10)
            ->get();

        $personalStats['recent_games'] = $recentGames->map(function ($game) {
            return [
                'rank' => $game->final_rank,
                'points_earned' => $game->points_earned,
                'player_count' => $game->player_count,
                'game_name' => json_decode($game->game_name, true) ?? 'Unbenannt',
                'date' => $game->created_at
            ];
        });

        // Platzierungs-Verteilung
        $placementDistribution = DB::table('player_rankings')
            ->where('user_id', $userId)
            ->select('final_rank', DB::raw('count(*) as count'))
            ->groupBy('final_rank')
            ->orderBy('final_rank')
            ->get()
            ->pluck('count', 'final_rank')
            ->toArray();

        $personalStats['placement_distribution'] = $placementDistribution;

        return response()->json($personalStats);
    }

    /**
     * Get ranking statistics overview
     */
    public function stats(Request $request)
    {
        $totalPlayers = User::where('total_ranking_points', '>', 0)->count();
        $totalGames = DB::table('player_rankings')->distinct('game_id')->count('game_id');
        $totalPoints = User::sum('total_ranking_points');

        $topPlayers = User::select('name', 'total_ranking_points')
            ->where('total_ranking_points', '>', 0)
            ->orderBy('total_ranking_points', 'desc')
            ->limit(3)
            ->get();

        return response()->json([
            'overview' => [
                'total_ranked_players' => $totalPlayers,
                'total_ranked_games' => $totalGames,
                'total_points_awarded' => $totalPoints,
                'average_points_per_player' => $totalPlayers > 0 ? round($totalPoints / $totalPlayers, 1) : 0
            ],
            'top_players' => $topPlayers
        ]);
    }
}