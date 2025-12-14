<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Game;
use App\Models\User;
use App\Services\RankingService;

class CalculateRankings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'rankings:calculate {--reset : Reset all rankings before calculating}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Calculate rankings for all finished games';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if ($this->option('reset')) {
            $this->info('Resetting all rankings...');
            User::query()->update([
                'total_ranking_points' => 0,
                'games_played' => 0,
                'best_placement' => null,
                'current_rating' => 1000, // Default Elo rating
            ]);
            $this->info('Rankings reset.');
        }

        $finishedGames = Game::where('status', 'finished')
            ->orWhere('status', 'completed')
            ->orWhere(function($query) {
                $query->whereNotIn('status', ['active', 'paused'])
                      ->whereNotNull('game_data');
            })
            ->get();
        $this->info("Processing {$finishedGames->count()} finished games...");

        $progressBar = $this->output->createProgressBar($finishedGames->count());
        $progressBar->start();

        foreach ($finishedGames as $game) {
            $this->processGame($game);
            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine();
        $this->info('Rankings calculation completed!');
    }

    private function processGame(Game $game)
    {
        $gameData = $game->game_data;

        if (!isset($gameData['players']) || !is_array($gameData['players'])) {
            return; // Skip invalid games
        }

        $players = $gameData['players'];
        $playerCount = count($players);

        // Sort players by placement (assuming lower placement number is better)
        usort($players, function ($a, $b) {
            return ($a['placement'] ?? 999) <=> ($b['placement'] ?? 999);
        });

        // Get opponent ratings for Elo calculation
        $opponentRatings = [];
        foreach ($players as $player) {
            if (isset($player['userId'])) {
                $user = User::find($player['userId']);
                if ($user) {
                    $opponentRatings[] = $user->current_rating ?? 1000;
                }
            }
        }

        foreach ($players as $index => $player) {
            if (!isset($player['userId']) || !isset($player['placement'])) {
                continue;
            }

            $userId = $player['userId'];
            $placement = $player['placement'];

            $user = User::find($userId);
            if (!$user) {
                continue;
            }

            // Calculate points
            $points = RankingService::calculatePoints($playerCount, $placement);

            // Calculate rating change
            $currentRating = $user->current_rating ?? 1000;
            $ratingChange = RankingService::calculateRatingChange(
                $currentRating,
                $opponentRatings,
                $placement,
                $playerCount,
                'casual' // Assume casual for now
            );

            // Update user stats
            $user->increment('total_ranking_points', $points);
            $user->increment('games_played', 1);

            if ($user->best_placement === null || $placement < $user->best_placement) {
                $user->best_placement = $placement;
            }

            $user->current_rating = $currentRating + $ratingChange;
            $user->save();
        }
    }
}
