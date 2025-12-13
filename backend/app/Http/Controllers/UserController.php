<?php

namespace App\Http\Controllers;

use App\UserRole;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

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
}
