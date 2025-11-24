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

        // User ist gebannt
        if ($user->isBanned()) {
            return response()->json([
                'message' => 'Ihr Account wurde gesperrt.'
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
