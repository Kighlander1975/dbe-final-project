<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$game = \App\Models\Game::where('admin_id', 5)->find(1);
if ($game) {
    echo 'Game found: ID=' . $game->id . ', admin_id=' . $game->admin_id . PHP_EOL;
} else {
    echo 'Game not found' . PHP_EOL;
}

$allGames = \App\Models\Game::all();
echo 'All games count: ' . $allGames->count() . PHP_EOL;
foreach($allGames as $g) {
    echo 'Game ID=' . $g->id . ', admin_id=' . $g->admin_id . PHP_EOL;
}
?>