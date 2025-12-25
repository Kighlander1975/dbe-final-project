<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminSettingController;

Route::get('/', function () {
    return view('welcome');
});

// Public settings
Route::get('/settings/count_up_duration', [AdminSettingController::class, 'getCountUpDuration']);
