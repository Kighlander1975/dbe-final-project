<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$game = DB::table('games')->where('id', 1)->first();
if ($game) {
    echo 'Raw game_data: ' . $game->game_data . PHP_EOL;
    $data = json_decode($game->game_data, true);
    echo 'Decoded rounds count: ' . count($data['rounds'] ?? []) . PHP_EOL;
    if (isset($data['rounds'][0]['bids'])) {
        echo 'First round bids: ' . implode(',', $data['rounds'][0]['bids']) . PHP_EOL;
    }
} else {
    echo 'Game not found' . PHP_EOL;
}
?>