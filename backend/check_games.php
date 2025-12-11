<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$games = DB::table('games')->get();
echo 'Found ' . $games->count() . ' games' . PHP_EOL;
foreach($games as $g) {
    $data = json_decode($g->game_data);
    echo $g->id . ': ' . $data->gameName . PHP_EOL;
}