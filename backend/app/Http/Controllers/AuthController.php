<?php
// app/Http/Controllers/AuthController.php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'email_verification_token' => Str::random(64),
            // role wird automatisch auf 'player' gesetzt (DB default) ⭐
        ]);

        // Verifizierungs-E-Mail senden
        $this->sendVerificationEmail($user);

        return response()->json([
            'message' => 'Registrierung erfolgreich! Bitte überprüfe deine E-Mails und verifiziere deine Adresse.',
            'email' => $user->email,
        ], 201);
    }

    /**
     * Login user and create token
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Die eingegebenen Zugangsdaten sind falsch.'
            ], 401);
        }

        // Check ob E-Mail verifiziert ist
        if (is_null($user->email_verified_at)) {
            return response()->json([
                'message' => 'Bitte verifiziere zuerst deine E-Mail-Adresse.',
                'error' => 'email_not_verified'
            ], 403);
        }

        // ⭐ NEU: Check ob User gebannt ist
        if ($user->isBanned()) {
            return response()->json([
                'message' => 'Ihr Account wurde gesperrt. Bitte kontaktieren Sie den Support.',
                'error' => 'account_banned'
            ], 403);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Login erfolgreich'
        ]);
    }

    /**
     * Logout user (revoke token)
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Erfolgreich abgemeldet'
        ]);
    }

    /**
     * Get authenticated user
     */
    public function user(Request $request)
    {
        $user = $request->user();

        // Doppelter Check (falls Token existiert aber unverifiziert)
        if (is_null($user->email_verified_at)) {
            return response()->json([
                'message' => 'E-Mail-Adresse nicht verifiziert.',
                'error' => 'email_not_verified'
            ], 403);
        }

        // ⭐ NEU: Check ob User gebannt wurde (nach Login)
        if ($user->isBanned()) {
            // Token widerrufen
            $request->user()->currentAccessToken()->delete();
            
            return response()->json([
                'message' => 'Ihr Account wurde gesperrt.',
                'error' => 'account_banned'
            ], 403);
        }

        return response()->json($user);
    }

    // ⭐ NEU: Check user role und permissions
    /**
     * Check user role and permissions
     */
    public function checkRole(Request $request)
    {
        $user = $request->user();
        
        return response()->json([
            'role' => $user->role->value,
            'label' => $user->getRoleLabel(),
            'permissions' => [
                'isAdmin' => $user->isAdmin(),
                'isPlayer' => $user->isPlayer(),
                'isBanned' => $user->isBanned(),
                'canAccessAdmin' => $user->canAccessAdmin(),
            ]
        ]);
    }

    /**
     * Verifizierungs-E-Mail senden
     */
    private function sendVerificationEmail(User $user)
    {
        $verificationUrl = config('app.frontend_url') . '/verify-email?token=' . $user->email_verification_token;

        Mail::raw(
            "Hallo {$user->name},\n\n" .
                "Bitte verifiziere deine E-Mail-Adresse:\n\n" .
                "{$verificationUrl}\n\n" .
                "Viele Grüße,\n" .
                "Dein Team",
            function ($message) use ($user) {
                $message->to($user->email)
                    ->subject('E-Mail-Adresse verifizieren');
            }
        );
    }
}
