<?php
// app/Http/Controllers/VerificationController.php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class VerificationController extends Controller
{
    /**
     * E-Mail verifizieren
     */
    public function verify(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        $user = User::where('email_verification_token', $request->token)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Ungültiger Verifizierungs-Token.'
            ], 400);
        }

        // Bereits verifiziert?
        if ($user->email_verified_at) {
            return response()->json([
                'message' => 'E-Mail-Adresse wurde bereits verifiziert.',
                'already_verified' => true
            ], 200);
        }

        // Verifizieren
        $user->email_verified_at = now();
        $user->email_verification_token = null; // Token löschen
        $user->save();

        return response()->json([
            'message' => 'E-Mail-Adresse erfolgreich verifiziert! Du kannst dich jetzt einloggen.',
            'verified' => true
        ], 200);
    }

    /**
     * Verifizierungs-E-Mail erneut senden
     */
    public function resend(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Benutzer nicht gefunden.'
            ], 404);
        }

        // Bereits verifiziert?
        if ($user->email_verified_at) {
            return response()->json([
                'message' => 'E-Mail-Adresse wurde bereits verifiziert.'
            ], 400);
        }

        // Neuen Token generieren
        $user->email_verification_token = Str::random(64);
        $user->save();

        // E-Mail senden
        $this->sendVerificationEmail($user);

        return response()->json([
            'message' => 'Verifizierungs-E-Mail wurde erneut gesendet.'
        ], 200);
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
