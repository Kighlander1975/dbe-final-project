<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Game::create([
            'admin_id' => 1, // Annahme: User mit ID 1 existiert
            'game_data' => [
                'gameName' => 'Test-Spiel',
                'players' => [
                    ['id' => 1, 'name' => 'Spieler 1', 'totalPoints' => 25],
                    ['id' => 2, 'name' => 'Spieler 2', 'totalPoints' => 20],
                ],
                'rounds' => [
                    [
                        'round' => 1,
                        'bids' => [2, 3],
                        'tricks' => [2, 3],
                        'points' => [4, 13],
                    ],
                ],
                'currentRound' => 2,
                'victoryCondition' => 100,
                'dealerIndex' => 0,
            ],
            'status' => 'active',
        ]);
    }
}
