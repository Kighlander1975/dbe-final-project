<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\EnsureEmailIsVerified;
use App\Http\Controllers\VerificationController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Verifizierungs-Routes (öffentlich)
Route::post('/verify-email', [VerificationController::class, 'verify']);
Route::post('/resend-verification', [VerificationController::class, 'resend']);

// Protected routes (Email verified required)
Route::middleware(['auth:sanctum', EnsureEmailIsVerified::class])->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Role-Check Endpoint (für alle authentifizierten User)
    Route::get('/user/role', [AuthController::class, 'checkRole']);
    
    // Admin-only routes
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::patch('/users/{user}/role', [UserController::class, 'updateRole']);
        Route::patch('/users/{user}/ban', [UserController::class, 'banUser']);
        Route::patch('/users/{user}/unban', [UserController::class, 'unbanUser']);
    });
});
