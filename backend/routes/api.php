<?php
// routes/api.php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Middleware\EnsureEmailIsVerified;
use App\Http\Controllers\VerificationController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Verifizierungs-Routes (öffentlich)
Route::post('/verify-email', [VerificationController::class, 'verify']);
Route::post('/resend-verification', [VerificationController::class, 'resend']);

// Protected routes
Route::middleware(['auth:sanctum', EnsureEmailIsVerified::class])->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
