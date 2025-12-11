<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Game>
 */
class GameFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'admin_id' => \App\Models\User::factory(),
            'game_data' => [
                'gameName' => $this->faker->word,
                'players' => [
                    ['id' => 1, 'name' => $this->faker->name, 'totalPoints' => 0],
                    ['id' => 2, 'name' => $this->faker->name, 'totalPoints' => 0],
                ],
                'rounds' => [],
                'currentRound' => 1,
                'victoryCondition' => 100,
                'dealerIndex' => 0,
            ],
            'status' => 'active',
        ];
    }
}
