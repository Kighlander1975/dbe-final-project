<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$game = \App\Models\Game::find(1);
if ($game) {
    echo 'Before update: ' . json_encode($game->game_data) . PHP_EOL;

    $game->game_data = array_merge($game->game_data, [
        'test_update' => 'updated_at_' . time()
    ]);
    $game->save();

    echo 'After update: ' . json_encode($game->game_data) . PHP_EOL;

    // Reload from DB
    $game->refresh();
    echo 'Reloaded from DB: ' . json_encode($game->game_data) . PHP_EOL;
} else {
    echo 'Game not found' . PHP_EOL;
}
?>