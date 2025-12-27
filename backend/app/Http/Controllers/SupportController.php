<?php

namespace App\Http\Controllers;

use App\Models\Support;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SupportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Nur Admins können alle Support-Tickets sehen
        if (!Auth::user() || !Auth::user()->is_admin) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $supports = Support::all();
        return response()->json($supports);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|in:Bug gefunden,Login-/Registrierungsproblem,sonstiges Problem,Nachricht an Admin',
            'urgency' => 'required|in:1 - notice,2 - info,3 - warning,4 - danger',
            'email' => 'nullable|email',
            'message' => 'required|string',
        ]);

        $email = Auth::check() ? Auth::user()->email : ($request->email ?: 'anonymus@stechen-helper.de');

        $support = Support::create([
            'status' => 'offen',
            'title' => $request->title,
            'urgency' => $request->urgency,
            'email' => $email,
            'message' => $request->message,
        ]);

        return response()->json($support, 201);
    }

    /**
     * Get user's own support tickets.
     */
    public function getUserTickets()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $tickets = Support::where('email', $user->email)->get();
        return response()->json($tickets);
    }

    /**
     * Get all open support tickets (Admin only).
     */
    public function getOpenTickets()
    {
        $user = Auth::user();
        if (!$user || !$user->is_admin) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $tickets = Support::where('status', '!=', 'geschlossen')->get();
        return response()->json($tickets);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $support = Support::findOrFail($id);

        // Nur der User selbst (wenn email passt) oder Admin
        $user = Auth::user();
        if (!$user || (!$user->is_admin && $user->email !== $support->email)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json($support);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $support = Support::findOrFail($id);
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Status ändern
        if ($request->has('status')) {
            if ($request->status === 'Fehlmeldung' && $support->status === 'offen' && $user->email === $support->email) {
                // OK
            } elseif ($user->is_admin) {
                // Admin kann alles
            } else {
                return response()->json(['error' => 'Cannot change status'], 403);
            }
            $support->status = $request->status;
        }

        // Message ändern
        if ($request->has('message')) {
            if ($user->is_admin || $user->email === $support->email) {
                $support->message = $request->message;
            } else {
                return response()->json(['error' => 'Cannot change message'], 403);
            }
        }

        // Urgency ändern
        if ($request->has('urgency')) {
            if ($user->is_admin || $user->email === $support->email) {
                $support->urgency = $request->urgency;
            } else {
                return response()->json(['error' => 'Cannot change urgency'], 403);
            }
        }

        $support->save();
        return response()->json($support);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Nur Admins
        if (!Auth::user() || !Auth::user()->is_admin) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $support = Support::findOrFail($id);
        $support->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
