<?php

namespace Tests\Feature;

use App\Models\Game;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GamePersistenceTest extends TestCase
{
    use RefreshDatabase;

    public function test_full_game_persistence_flow()
    {
        // Create admin user
        $admin = User::factory()->create(['role' => 'admin']);

        // Create regular user
        $user = User::factory()->create();

        // Login as admin and create game
        $loginResponse = $this->postJson('/api/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);

        $loginResponse->assertStatus(200);
        $token = $loginResponse->json('token');

        $gameData = [
            'gameName' => 'Test Game',
            'players' => [
                ['name' => 'Player 1'],
                ['name' => 'Player 2'],
            ],
            'victoryCondition' => 1000,
        ];

        $createResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/games', $gameData);

        $createResponse->assertStatus(201);
        $gameId = $createResponse->json('id');

        $expectedGameData = [
            'gameName' => 'Test Game',
            'players' => [
                ['name' => 'Player 1'],
                ['name' => 'Player 2'],
            ],
            'rounds' => [],
            'currentRound' => 1,
            'victoryCondition' => 1000,
            'dealerIndex' => 0,
        ];

        $game = Game::find($gameId);
        $this->assertEquals($expectedGameData, $game->game_data);

        // Login as regular user and read game
        $userLoginResponse = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $userLoginResponse->assertStatus(200);
        $userToken = $userLoginResponse->json('token');

        $readResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $userToken,
        ])->getJson("/api/games/{$gameId}");

        $readResponse->assertStatus(200)
                    ->assertJson([
                        'id' => $gameId,
                        'admin_id' => $admin->id,
                    ]);

        // Update game as admin
        $updatedGameData = [
            'gameName' => 'Updated Test Game',
            'players' => [
                ['name' => 'Player 1'],
                ['name' => 'Player 2'],
                ['name' => 'Player 3'],
            ],
            'rounds' => [],
            'currentRound' => 1,
            'victoryCondition' => 1500,
            'dealerIndex' => 0,
        ];

        $updateResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->patchJson("/api/games/{$gameId}", [
            'game_data' => $updatedGameData,
        ]);

        $updateResponse->assertStatus(200);

        // Verify game was updated
        $updatedGame = Game::find($gameId);
        $this->assertEquals($updatedGameData, $updatedGame->game_data);
    }
}