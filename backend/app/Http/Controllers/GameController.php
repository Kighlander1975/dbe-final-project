<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\Game;
use App\Services\RankingService;
use App\Models\User;

class GameController extends Controller
{
    /**
     * Display the specified game (für alle auth User, readonly).
     */
    public function show(string $id)
    {
        $game = Game::findOrFail($id);
        Log::info('GameController@show called', [
            'game_id' => $id,
            'game_data' => $game->game_data
        ]);
        return response()->json($game);
    }

    /**
     * ⭐ Check if user has an active or paused game
     */
    public function hasActiveGame(Request $request)
    {
        $activeGame = Game::where('admin_id', $request->user()->id)
                         ->whereIn('status', ['active', 'paused'])
                         ->first();

        return response()->json([
            'hasActiveGame' => $activeGame !== null,
            'activeGame' => $activeGame ? [
                'id' => $activeGame->id,
                'gameName' => $activeGame->game_data['gameName'] ?? 'Unbenanntes Spiel',
                'status' => $activeGame->status
            ] : null
        ]);
    }

    /**
     * ⭐ Get all games for the authenticated user (Host only)
     */
    public function getUserGames(Request $request)
    {
        $games = Game::where('admin_id', $request->user()->id)
                    ->whereIn('status', ['active', 'paused'])
                    ->orderBy('updated_at', 'desc')
                    ->get();

        $formattedGames = $games->map(function ($game) {
            $gameData = $game->game_data;
            $players = $gameData['players'] ?? [];
            $currentPoints = [];
            $ranks = [];

            // Berechne aktuelle Punkte und Ränge aus der letzten Runde
            if (!empty($gameData['rounds'])) {
                $lastRound = end($gameData['rounds']);
                $currentPoints = $lastRound['points'] ?? [];
                // Ränge berechnen
                $pointsWithIndex = array_map(function($points, $index) {
                    return ['points' => $points, 'index' => $index];
                }, $currentPoints, array_keys($currentPoints));
                usort($pointsWithIndex, function($a, $b) {
                    return $b['points'] <=> $a['points'];
                });
                $rank = 1;
                $prevPoints = null;
                foreach ($pointsWithIndex as $item) {
                    if ($prevPoints !== null && $item['points'] < $prevPoints) {
                        $rank++;
                    }
                    $ranks[$item['index']] = $rank;
                    $prevPoints = $item['points'];
                }
            }

            return [
                'id' => $game->id,
                'gameName' => $gameData['gameName'] ?? 'Unbenanntes Spiel',
                'status' => $game->status,
                'players' => array_map(function($player, $index) use ($currentPoints, $ranks) {
                    return [
                        'name' => $player['name'] ?? 'Unbekannt',
                        'points' => $currentPoints[$index] ?? 0,
                        'rank' => $ranks[$index] ?? 1
                    ];
                }, $players, array_keys($players)),
                'created_at' => $game->created_at,
                'updated_at' => $game->updated_at
            ];
        });

        return response()->json([
            'games' => $formattedGames,
            'totalGames' => $formattedGames->count(),
            'canCreateNewGame' => $formattedGames->count() < 3
        ]);
    }

    /**
     * Store a newly created game (nur Admins).
     */
    public function store(Request $request)
    {
        Log::info('GameController@store called', [
            'user' => $request->user() ? $request->user()->id : 'no user',
            'request_data' => $request->all(),
            'headers' => $request->headers->all()
        ]);

        // ⭐ Check if admin already has an active game
        $existingActiveGame = Game::where('admin_id', $request->user()->id)
                                 ->where('status', 'active')
                                 ->first();

        if ($existingActiveGame) {
            return response()->json([
                'error' => 'Du hast bereits ein aktives Spiel. Beende es zuerst, bevor du ein neues erstellst.',
                'activeGame' => [
                    'id' => $existingActiveGame->id,
                    'gameName' => $existingActiveGame->game_data['gameName'] ?? 'Unbenanntes Spiel'
                ]
            ], 409); // Conflict status code
        }

        $validator = Validator::make($request->all(), [
            'gameName' => 'required|string|max:255',
            'players' => 'required|array|min:2|max:10',
            'players.*.name' => 'required|string|max:100',
            'victoryCondition' => 'required|integer|min:10|max:1000',
        ]);

        if ($validator->fails()) {
            Log::error('Game validation failed:', $validator->errors()->toArray());
            Log::error('Request data:', $request->all());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $game = Game::create([
            'admin_id' => $request->user()->id,
            'game_data' => [
                'gameName' => $request->gameName,
                'players' => $request->players,
                'rounds' => [],
                'currentRound' => 1,
                'victoryCondition' => $request->victoryCondition,
                'dealerIndex' => rand(0, count($request->players) - 1), // Zufälliger Dealer
            ],
            'status' => 'active',
        ]);

        return response()->json($game, 201);
    }

    /**
     * Update the specified game (nur Admins, nur eigene Spiele).
     */
    public function update(Request $request, string $id)
    {
        $game = Game::where('admin_id', $request->user()->id)->findOrFail($id);

        Log::info('Game found for update', [
            'game_id' => $id,
            'found_game_id' => $game->id,
            'admin_id' => $game->admin_id,
            'user_id' => $request->user()->id
        ]);

        Log::info('GameController@update called', [
            'game_id' => $id,
            'user_id' => $request->user()->id,
            'request_data' => $request->all()
        ]);

        $validator = Validator::make($request->all(), [
            'game_data' => 'required|array',
            // Weitere Validierung je nach Bedarf
        ]);

        if ($validator->fails()) {
            Log::error('Game update validation failed:', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        Log::info('About to update game', [
            'game_id' => $id,
            'old_game_data' => $game->game_data,
            'new_game_data' => $request->game_data
        ]);

        // Verwende DB::update statt Eloquent update
        DB::table('games')->where('id', $id)->update([
            'game_data' => json_encode($request->game_data),
            'updated_at' => now()
        ]);

        // Reload das Game
        $game->refresh();

        Log::info('Game updated successfully', [
            'game_id' => $id,
            'updated_game_data' => $game->game_data
        ]);

        return response()->json($game);
    }

    /**
     * ⭐ Resume a game (set status to active) - Host only
     */
    public function resumeGame(Request $request, string $id)
    {
        $game = Game::where('admin_id', $request->user()->id)->findOrFail($id);

        // Prüfen, ob bereits ein anderes Spiel aktiv ist
        $activeGame = Game::where('admin_id', $request->user()->id)
                         ->where('status', 'active')
                         ->where('id', '!=', $id)
                         ->first();

        if ($activeGame) {
            return response()->json([
                'error' => 'Ein anderes Spiel ist bereits aktiv. Bitte beende es zuerst.'
            ], 409);
        }

        $game->update(['status' => 'active']);

        Log::info('Game resumed', [
            'game_id' => $id,
            'admin_id' => $request->user()->id
        ]);

        return response()->json([
            'message' => 'Spiel erfolgreich aktiviert',
            'game' => $game
        ]);
    }

    /**
     * ⭐ Pause a game (set status to paused) - Host only
     */
    public function pauseGame(Request $request, string $id)
    {
        $game = Game::where('admin_id', $request->user()->id)->findOrFail($id);

        $game->update(['status' => 'paused']);

        Log::info('Game paused', [
            'game_id' => $id,
            'admin_id' => $request->user()->id
        ]);

        return response()->json([
            'message' => 'Spiel erfolgreich pausiert',
            'game' => $game
        ]);
    }

    /**
     * ⭐ Finish a game (set status to finished) - Host only
     */
    public function finishGame(Request $request, string $id)
    {
        $game = Game::where('admin_id', $request->user()->id)->findOrFail($id);

        // Berechne Rankings für alle registrierten Spieler VOR dem Status-Update
        $this->calculateAndStoreRankings($game);

        $game->update(['status' => 'finished']);

        Log::info('Game finished', [
            'game_id' => $id,
            'admin_id' => $request->user()->id
        ]);

        return response()->json([
            'message' => 'Spiel erfolgreich beendet',
            'game' => $game
        ]);
    }

    /**
     * Remove the specified game (Host only, nur eigene Spiele).
     */
    public function destroy(Request $request, string $id)
    {
        $game = Game::where('admin_id', $request->user()->id)->findOrFail($id);
        $game->delete();

        return response()->json(['message' => 'Game deleted']);
    }

    /**
     * Berechne und speichere Rankings für alle registrierten Spieler eines beendeten Spiels
     */
    private function calculateAndStoreRankings(Game $game)
    {
        try {
        $gameData = $game->game_data;
        $players = $gameData['players'] ?? [];
        $rounds = $gameData['rounds'] ?? [];

        if (empty($players) || empty($rounds)) {
            Log::warning('Cannot calculate rankings: missing players or rounds', [
                'game_id' => $game->id,
                'players_count' => count($players),
                'rounds_count' => count($rounds)
            ]);
            return;
        }

        $playerCount = count($players);
        $gameType = RankingService::getGameType($playerCount);

        // Berechne Endpunkte für jeden Spieler
        $finalPoints = array_fill(0, $playerCount, 0);

        // Verwende totalPoints aus players, falls verfügbar (für bereits berechnete Spiele)
        $hasTotalPoints = !empty(array_filter($players, fn($p) => isset($p['totalPoints'])));

        if ($hasTotalPoints) {
            // Verwende die gespeicherten totalPoints
            foreach ($players as $index => $player) {
                $finalPoints[$index] = $player['totalPoints'] ?? 0;
            }
        } else {
            // Berechne aus rounds
            foreach ($rounds as $round) {
                if (isset($round['points'])) {
                    foreach ($round['points'] as $playerIndex => $points) {
                        $finalPoints[$playerIndex] += $points;
                    }
                }
            }
        }

        // Sortiere Spieler nach Punkten (absteigend) für Platzierungen
        $playersWithPoints = [];
        foreach ($players as $index => $player) {
            $playersWithPoints[] = [
                'index' => $index,
                'player' => $player,
                'points' => $finalPoints[$index] ?? 0
            ];
        }

        usort($playersWithPoints, function($a, $b) {
            return $b['points'] <=> $a['points'];
        });

        // Weise Platzierungen zu (1-basiert)
        $placements = [];
        $currentRank = 1;
        $prevPoints = null;

        foreach ($playersWithPoints as $playerData) {
            if ($prevPoints !== null && $playerData['points'] < $prevPoints) {
                $currentRank++;
            }
            $placements[$playerData['index']] = $currentRank;
            $prevPoints = $playerData['points'];
        }

        // Speichere Rankings für registrierte Spieler
        foreach ($players as $playerIndex => $player) {
            $userId = $player['userId'] ?? null;

            // Überspringe Gäste (keine userId)
            if (!$userId) {
                continue;
            }

            $placement = $placements[$playerIndex];
            $pointsEarned = RankingService::calculatePoints($playerCount, $placement);

            // Finde User - userId kann ID (int) oder Email (string) sein
            if (is_numeric($userId)) {
                $user = User::find($userId);
            } else {
                $user = User::where('email', $userId)->first();
            }

            if (!$user) {
                Log::warning('User not found for ranking', [
                    'game_id' => $game->id,
                    'userId' => $userId,
                    'player_index' => $playerIndex
                ]);
                continue;
            }
            // Speichere in player_rankings Tabelle
            DB::table('player_rankings')->insert([
                'user_id' => $user->id,
                'game_id' => $game->id,
                'player_count' => $playerCount,
                'final_rank' => $placement,
                'points_earned' => $pointsEarned,
                'created_at' => now()
            ]);

            // Update User-Statistiken
            $user->increment('total_ranking_points', $pointsEarned);
            $user->increment('games_played');

            // Update beste Platzierung (niedrigste Zahl = beste Platzierung)
            if ($user->best_placement === null || $placement < $user->best_placement) {
                $user->best_placement = $placement;
            }

            // Elo-Rating Update mit vollständiger Logik
            $opponentRatings = [];
            foreach ($players as $opponentIndex => $opponent) {
                if ($opponentIndex !== $playerIndex && isset($opponent['userId'])) {
                    $opponentUser = User::find($opponent['userId']);
                    if ($opponentUser) {
                        $opponentRatings[] = $opponentUser->current_rating;
                    }
                }
            }

            $ratingChange = RankingService::calculateRatingChange(
                $user->current_rating,
                $opponentRatings,
                $placement,
                $playerCount,
                $gameType
            );

            $oldRating = $user->current_rating;
            $user->current_rating = max(800, $user->current_rating + $ratingChange);

            $user->save();

            Log::info('Ranking stored for player', [
                'game_id' => $game->id,
                'user_id' => $user->id,
                'user_email' => $user->email,
                'placement' => $placement,
                'points_earned' => $pointsEarned
            ]);
        }

        Log::info('Rankings calculated and stored', [
            'game_id' => $game->id,
            'total_players' => $playerCount,
            'registered_players' => count(array_filter($players, fn($p) => isset($p['userId'])))
        ]);
        } catch (\Exception $e) {
            Log::error('Failed to calculate and store rankings', [
                'game_id' => $game->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            // Re-throw to prevent status update
            throw $e;
        }
    }
}
