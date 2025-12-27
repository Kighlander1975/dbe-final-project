<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\StatsController;
use App\Http\Controllers\HostRequestController;
use App\Http\Controllers\AdminSettingController;
use App\Http\Controllers\RankingController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\SupportController;
use App\Http\Middleware\EnsureEmailIsVerified;
use Illuminate\Support\Facades\Route;

// Public routes (ohne CSRF für SPA-Login)
Route::withoutMiddleware([\Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class])->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Verifizierungs-Routes (öffentlich)
    Route::post('/verify-email', [VerificationController::class, 'verify']);
    Route::post('/resend-verification', [VerificationController::class, 'resend']);

    // ⭐ NEU: Public User List (ÖFFENTLICH, für Spielerauswahl)
    Route::get('/users', [UserController::class, 'publicIndex'])->name('users.public');

    // Password Reset Routes (öffentlich)
    Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
    Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);
});

// ⭐ Public Version (ÖFFENTLICH, für Header-Anzeige)
Route::get('/version', [AdminSettingController::class, 'getVersion']);

// ⭐ Public Debug Setting (ÖFFENTLICH, für Header-Anzeige)
Route::get('/admin/settings/debug_server_error', [AdminSettingController::class, 'getDebugSetting']);

// ⭐ Public Count-Up Duration (ÖFFENTLICH, für Animation)
Route::get('/settings/count_up_duration', [AdminSettingController::class, 'getCountUpDuration']);

// ⭐ Public Support Create (ÖFFENTLICH, für Support-Tickets)
Route::post('/support', [SupportController::class, 'store']);

// Protected routes (Email verified required)
Route::middleware(['auth:sanctum', EnsureEmailIsVerified::class])->group(function () {
    
    // Role-Check Endpoint (für alle authentifizierten User)
    Route::get('/user/role', [AuthController::class, 'checkRole']);
    Route::post('/user/change-password', [AuthController::class, 'changePassword']);
    
    // Admin-only routes
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        // ⭐ Reset Rankings (Admin only) - MUSS vor apiResource stehen!
        Route::delete('/settings/reset-rankings', [AdminSettingController::class, 'resetRankings']);

        Route::get('/users', [UserController::class, 'index'])->name('users.admin');
        Route::post('/users', [UserController::class, 'store']);
        Route::patch('/users/{user}/role', [UserController::class, 'updateRole']);
        Route::patch('/users/{user}/name', [UserController::class, 'updateName']);
        Route::patch('/users/{user}/email-verified-at', [UserController::class, 'updateEmailVerifiedAt']);
        Route::patch('/users/{user}/ban', [UserController::class, 'banUser']);
        Route::patch('/users/{user}/unban', [UserController::class, 'unbanUser']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);
        // ⭐ Admin Stats
        Route::get('/stats', [StatsController::class, 'adminStats']);
        // ⭐ Test Email
        Route::post('/test-email', [UserController::class, 'sendTestEmail']);

        // ⭐ Admin Settings
        Route::apiResource('/settings', AdminSettingController::class)->parameters([
            'settings' => 'key'
        ]);

        // Host Request routes
        Route::post('/host-requests', [HostRequestController::class, 'store']); // Player: Anfrage stellen
    });

    // Admin only routes
    Route::middleware('role:admin')->group(function () {
        // User management
        Route::get('/users', [UserController::class, 'index']);
        Route::patch('/users/{user}', [UserController::class, 'update']);

        // Host Request admin routes
        Route::get('/host-requests', [HostRequestController::class, 'index']);
        Route::post('/host-requests/mark-seen', [HostRequestController::class, 'markAsSeen']);
        Route::post('/host-requests/{hostRequest}/approve', [HostRequestController::class, 'approve']);
        Route::post('/host-requests/{hostRequest}/reject', [HostRequestController::class, 'reject']);
        Route::post('/host-requests/{hostRequest}/revoke', [HostRequestController::class, 'revoke']);
    });

    // Game routes (für Persistenz während Spielen)
    Route::prefix('games')->group(function () {
        Route::middleware('role:admin,host')->group(function () {
            Route::post('/', [GameController::class, 'store']); // Neues Spiel
            Route::get('/active', [GameController::class, 'hasActiveGame']); // ⭐ Prüfen ob User aktives Spiel hat
        });
        // ⭐ Host kann eigene Spiele verwalten
        Route::get('/user-games', [GameController::class, 'getUserGames']); // Alle Spiele des Users
        Route::patch('/{id}/resume', [GameController::class, 'resumeGame']); // Spiel fortsetzen (Status auf active)
        Route::patch('/{id}/pause', [GameController::class, 'pauseGame']); // Spiel pausieren
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

    // ⭐ Ranking routes (für alle auth User, readonly)
    Route::prefix('rankings')->group(function () {
        Route::get('/', [RankingController::class, 'index']); // Top-Rankings
        Route::get('/stats', [RankingController::class, 'stats']); // Ranking-Übersicht
        Route::get('/{userId}', [RankingController::class, 'show']); // Persönliche Details
    });

    // ⭐ Support routes (auth required)
    Route::prefix('support')->group(function () {
        Route::get('/', [SupportController::class, 'index']); // Admin only
        Route::get('/user', [SupportController::class, 'getUserTickets']); // User own tickets
        Route::get('/open', [SupportController::class, 'getOpenTickets']); // Admin open tickets
        Route::get('/{id}', [SupportController::class, 'show']); // User or Admin
        Route::patch('/{id}', [SupportController::class, 'update']); // User or Admin with restrictions
        Route::delete('/{id}', [SupportController::class, 'destroy']); // Admin only
    });
});
