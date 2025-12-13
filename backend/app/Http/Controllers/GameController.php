<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Game;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
}
