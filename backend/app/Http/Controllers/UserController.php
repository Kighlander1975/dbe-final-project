<?php

namespace App\Http\Controllers;

use App\UserRole;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

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
}
