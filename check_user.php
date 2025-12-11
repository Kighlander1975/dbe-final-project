<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::find(5);
echo 'User 5 role: ' . ($user ? $user->role : 'not found') . PHP_EOL;
?>