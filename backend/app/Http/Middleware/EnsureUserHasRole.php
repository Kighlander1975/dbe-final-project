<?php

namespace App\Http\Middleware;

use App\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        // User muss eingeloggt sein
        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.'
            ], 401);
        }

        // Bei schreibenden Operationen (POST, PUT, PATCH, DELETE) Rolle frisch aus DB laden
        // um DB-Manipulationen zu erkennen
        if (in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'])) {
            $user->refresh(); // Lädt User frisch aus DB
        }

        // User ist gebannt - sofort ausloggen
        if ($user->isBanned()) {
            // Token invalidieren
            $request->user()->currentAccessToken()->delete();
            
            return response()->json([
                'message' => 'Ihr Account wurde gesperrt und Sie wurden ausgeloggt.',
                'logout' => true
            ], 403);
        }

        // Konvertiere String-Rollen zu Enum
        $allowedRoles = array_map(
            fn($role) => UserRole::from($role),
            $roles
        );

        // Prüfe ob User eine der erlaubten Rollen hat
        if (!$user->hasAnyRole($allowedRoles)) {
            return response()->json([
                'message' => 'Sie haben keine Berechtigung für diese Aktion.'
            ], 403);
        }

        return $next($request);
    }
}
