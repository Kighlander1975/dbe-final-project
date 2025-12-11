<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$game = \App\Models\Game::find(1);
echo 'Current game_data: ' . json_encode($game->game_data) . PHP_EOL;
?>