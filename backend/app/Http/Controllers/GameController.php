<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Game;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class GameController extends Controller
{
    /**
     * Display the specified game (für alle auth User, readonly).
     */
    public function show(string $id)
    {
        $game = Game::findOrFail($id);
        \Log::info('GameController@show called', [
            'game_id' => $id,
            'game_data' => $game->game_data
        ]);
        return response()->json($game);
    }

    /**
     * Store a newly created game (nur Admins).
     */
    public function store(Request $request)
    {
        \Log::info('GameController@store called', [
            'user' => $request->user() ? $request->user()->id : 'no user',
            'request_data' => $request->all(),
            'headers' => $request->headers->all()
        ]);

        $validator = Validator::make($request->all(), [
            'gameName' => 'required|string|max:255',
            'players' => 'required|array|min:2|max:10',
            'players.*.name' => 'required|string|max:100',
            'victoryCondition' => 'required|integer|min:10|max:1000',
        ]);

        if ($validator->fails()) {
            \Log::error('Game validation failed:', $validator->errors()->toArray());
            \Log::error('Request data:', $request->all());
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
                'dealerIndex' => 0,
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

        \Log::info('Game found for update', [
            'game_id' => $id,
            'found_game_id' => $game->id,
            'admin_id' => $game->admin_id,
            'user_id' => $request->user()->id
        ]);

        \Log::info('GameController@update called', [
            'game_id' => $id,
            'user_id' => $request->user()->id,
            'request_data' => $request->all()
        ]);

        $validator = Validator::make($request->all(), [
            'game_data' => 'required|array',
            // Weitere Validierung je nach Bedarf
        ]);

        if ($validator->fails()) {
            \Log::error('Game update validation failed:', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        \Log::info('About to update game', [
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

        \Log::info('Game updated successfully', [
            'game_id' => $id,
            'updated_game_data' => $game->game_data
        ]);

        return response()->json($game);
    }

    /**
     * Remove the specified game (nur Admins, nur eigene Spiele).
     */
    public function destroy(Request $request, string $id)
    {
        $game = Game::where('admin_id', $request->user()->id)->findOrFail($id);
        $game->delete();

        return response()->json(['message' => 'Game deleted']);
    }
}
