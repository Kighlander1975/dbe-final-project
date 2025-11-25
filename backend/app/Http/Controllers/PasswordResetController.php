<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Models\User;
use App\Mail\ResetPasswordMail;
use Carbon\Carbon;

class PasswordResetController extends Controller
{
    /**
     * 📧 Schritt 1: Passwort-Reset-Link per E-Mail senden
     */
    public function sendResetLink(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ], [
            'email.exists' => 'Diese E-Mail-Adresse ist nicht registriert.'
        ]);

        // Alten Token löschen (falls vorhanden)
        DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->delete();

        // Neuen Token generieren
        $token = Str::random(64);

        // Token in DB speichern
        DB::table('password_reset_tokens')->insert([
            'email' => $request->email,
            'token' => Hash::make($token), // Token gehasht speichern
            'created_at' => Carbon::now()
        ]);

        // E-Mail senden
        $user = User::where('email', $request->email)->first();
        Mail::to($request->email)->send(new ResetPasswordMail($token, $user->name));

        return response()->json([
            'message' => 'Passwort-Reset-Link wurde an deine E-Mail gesendet.'
        ], 200);
    }

    /**
     * 🔐 Schritt 2: Passwort zurücksetzen
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed'
        ]);

        // Token aus DB holen
        $resetRecord = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        // Prüfen ob Token existiert
        if (!$resetRecord) {
            return response()->json([
                'message' => 'Ungültiger oder abgelaufener Token.'
            ], 400);
        }

        // Token vergleichen (gehashter Token in DB)
        if (!Hash::check($request->token, $resetRecord->token)) {
            return response()->json([
                'message' => 'Ungültiger Token.'
            ], 400);
        }

        // Prüfen ob Token älter als 60 Minuten
        $createdAt = Carbon::parse($resetRecord->created_at);
        if ($createdAt->addMinutes(60)->isPast()) {
            DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->delete();

            return response()->json([
                'message' => 'Token ist abgelaufen. Bitte fordere einen neuen an.'
            ], 400);
        }

        // Passwort aktualisieren
        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        // Token löschen
        DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->delete();

        return response()->json([
            'message' => 'Passwort erfolgreich zurückgesetzt!'
        ], 200);
    }
}
