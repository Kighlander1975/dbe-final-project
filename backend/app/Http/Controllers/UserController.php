<?php

namespace App\Http\Controllers;

use App\UserRole;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Get all users (Admin only)
     */
    public function index(Request $request)
    {
        $users = User::query()
            ->when($request->role, function ($query, $role) {
                $query->where('role', $role);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($users);
    }

    /**
     * Create a new user (Admin only)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => ['required', Rule::enum(UserRole::class)]
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'email_verified_at' => now(),
            'total_ranking_points' => 0,
            'games_played' => 0,
            'best_placement' => null,
            'current_rating' => 1000.00,
            'remember_token' => null,
        ]);

        return response()->json([
            'message' => 'Benutzer erfolgreich erstellt.',
            'user' => $user
        ], 201);
    }

    /**
     * Get public user list (for game player selection)
     * Shows all users except banned ones
     */
    public function publicIndex(Request $request)
    {
        $users = User::query()
            ->where('role', '!=', UserRole::BANNED->value)
            ->orderBy('name', 'asc')
            ->get(['id', 'name', 'email']);

        return response()->json([
            'data' => $users,
            'current_page' => 1,
            'last_page' => 1,
            'per_page' => $users->count(),
            'total' => $users->count()
        ]);
    }

    /**
     * Update user role (Admin only)
     */
    public function updateRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => ['required', Rule::enum(UserRole::class)]
        ]);

        $user->setRole(UserRole::from($validated['role']));

        return response()->json([
            'message' => 'Rolle erfolgreich aktualisiert.',
            'user' => $user
        ]);
    }

    /**
     * Update user name (Admin only)
     */
    public function updateName(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', 'regex:/^[a-zA-Z0-9äöüÄÖÜß!^()<>éøåçñàèìòùâêîôûëïüÿæœÀÈÌÒÙÂÊÎÔÛËÏÜŸÆŒ\s]+$/']
        ]);

        $user->name = $validated['name'];
        $user->save();

        return response()->json([
            'message' => 'Name erfolgreich aktualisiert.',
            'user' => $user
        ]);
    }

    /**
     * Update user email verified at (Admin only)
     */
    public function updateEmailVerifiedAt(Request $request, User $user)
    {
        $validated = $request->validate([
            'email_verified' => 'required|boolean'
        ]);

        $user->email_verified_at = $validated['email_verified'] ? now() : null;
        $user->save();

        return response()->json([
            'message' => 'E-Mail-Verifizierung erfolgreich aktualisiert.',
            'user' => $user
        ]);
    }

    /**
     * Ban user (Admin only)
     */
    public function banUser(User $user)
    {
        if ($user->isAdmin()) {
            return response()->json([
                'message' => 'Administratoren können nicht gesperrt werden.'
            ], 403);
        }

        $user->setRole(UserRole::BANNED);

        return response()->json([
            'message' => 'Benutzer wurde gesperrt.',
            'user' => $user
        ]);
    }

    /**
     * Unban user (Admin only)
     */
    public function unbanUser(User $user)
    {
        $user->setRole(UserRole::PLAYER);

        return response()->json([
            'message' => 'Sperrung wurde aufgehoben.',
            'user' => $user
        ]);
    }

    /**
     * Send test email (Admin only)
     */
    public function sendTestEmail(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email'
        ]);

        try {
            Mail::raw('Dies ist eine Test-E-Mail von Stechen-Helper. Wenn du diese E-Mail erhältst, funktioniert die E-Mail-Konfiguration korrekt!', function ($message) use ($validated) {
                $message->to($validated['email'])
                        ->subject('Stechen-Helper Test-E-Mail');
            });

            return response()->json([
                'message' => 'Test-E-Mail wurde erfolgreich gesendet.'
            ]);
        } catch (\Exception $e) {
            Log::error('Test email failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Fehler beim Senden der Test-E-Mail: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update user (Admin only)
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:100', 'regex:/^[a-zA-Z0-9äöüÄÖÜß!^()<>éøåçñàèìòùâêîôûëïüÿæœÀÈÌÒÙÂÊÎÔÛËÏÜŸÆŒ\s]+$/'],
            'email' => ['sometimes', 'email', 'unique:users,email,' . $user->id],
            'role' => ['sometimes', Rule::enum(UserRole::class)]
        ]);

        if (isset($validated['name'])) {
            $user->name = $validated['name'];
        }

        if (isset($validated['email'])) {
            $user->email = $validated['email'];
        }

        if (isset($validated['role'])) {
            $user->setRole(UserRole::from($validated['role']));
        }

        $user->save();

        return response()->json([
            'message' => 'Benutzer erfolgreich aktualisiert.',
            'user' => $user
        ]);
    }

    /**
     * Delete user (Admin only)
     */
    public function destroy(User $user)
    {
        if ($user->isAdmin()) {
            return response()->json([
                'message' => 'Administratoren können nicht gelöscht werden.'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'Benutzer wurde erfolgreich gelöscht.'
        ]);
    }
}
