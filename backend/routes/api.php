<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\StatsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VerificationController;
use App\Http\Middleware\EnsureEmailIsVerified;

// Public routes (ohne CSRF für SPA-Login)
Route::withoutMiddleware([\Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class])->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Verifizierungs-Routes (öffentlich)
    Route::post('/verify-email', [VerificationController::class, 'verify']);
    Route::post('/resend-verification', [VerificationController::class, 'resend']);

    // ⭐ NEU: Public User List (ÖFFENTLICH, für Spielerauswahl)
    Route::get('/users', [UserController::class, 'index'])->name('users.public');

    // Password Reset Routes (öffentlich)
    Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
    Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);
});

// Protected routes (Email verified required)
Route::middleware(['auth:sanctum', EnsureEmailIsVerified::class])->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // 🆕 Heartbeat für Session-Erneuerung
    Route::get('/heartbeat', [AuthController::class, 'heartbeat']);
    
    // Role-Check Endpoint (für alle authentifizierten User)
    Route::get('/user/role', [AuthController::class, 'checkRole']);
    Route::post('/user/change-password', [AuthController::class, 'changePassword']);
    
    // Admin-only routes
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users.admin');
        Route::patch('/users/{user}/role', [UserController::class, 'updateRole']);
        Route::patch('/users/{user}/ban', [UserController::class, 'banUser']);
        Route::patch('/users/{user}/unban', [UserController::class, 'unbanUser']);
    });

    // Game routes (für Persistenz während Spielen)
    Route::prefix('games')->group(function () {
        Route::middleware('role:admin')->group(function () {
            Route::post('/', [GameController::class, 'store']); // Neues Spiel
            Route::get('/active', [GameController::class, 'hasActiveGame']); // ⭐ Prüfen ob User aktives Spiel hat
        });
        // ⭐ Host kann eigene Spiele pausieren/beenden/löschen        Route::get('/user-games', [GameController::class, 'getUserGames']); // Alle Spiele des Users        Route::patch('/{id}/pause', [GameController::class, 'pauseGame']); // Spiel pausieren
        Route::patch('/{id}/finish', [GameController::class, 'finishGame']); // Spiel beenden (Status auf finished)
        Route::delete('/{id}', [GameController::class, 'destroy']); // Spiel löschen
        Route::patch('/{id}', [GameController::class, 'update']); // Update Spiel (temporär ohne role)
        Route::get('/{id}', [GameController::class, 'show']); // Spiel lesen (für alle auth User)
    });

    // Stats routes (für alle auth User, readonly)
    Route::prefix('stats')->group(function () {
        Route::get('/players', [StatsController::class, 'players']);
        Route::get('/player/{id}', [StatsController::class, 'player']);
    });
});
