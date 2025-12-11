<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Game;

class GameControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_game()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $this->actingAs($admin, 'sanctum')->withoutMiddleware();

        $gameData = [
            'gameName' => 'Test Game',
            'players' => [
                ['name' => 'Player 1'],
                ['name' => 'Player 2'],
            ],
            'victoryCondition' => 100,
        ];

        $response = $this->postJson('/api/games', $gameData);

        $response->assertStatus(201)
                 ->assertJsonStructure(['id', 'game_data', 'status']);

        $this->assertDatabaseHas('games', ['admin_id' => $admin->id]);
    }

    public function test_user_can_view_game()
    {
        $user = User::factory()->create();
        $game = Game::factory()->create();
        $this->actingAs($user, 'sanctum')->withoutMiddleware();

        $response = $this->getJson("/api/games/{$game->id}");

        $response->assertStatus(200)
                 ->assertJson(['id' => $game->id]);
    }
}
