<?php

namespace App\Http\Controllers;

use App\Models\HostRequest;
use App\Models\User;
use App\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\HostRequestConfirmation;
use App\Mail\HostRequestApproved;
use App\Mail\HostRequestRejected;
use App\Mail\HostRequestRevoked;

class HostRequestController extends Controller
{
    public function index(Request $request)
    {
        $query = HostRequest::with('user');

        // Filter
        if ($request->has('status')) {
            switch ($request->status) {
                case 'unseen':
                    $query->whereNull('seen_at');
                    break;
                case 'seen':
                    $query->whereNotNull('seen_at')->whereNull('allowed_at');
                    break;
                case 'approved':
                    $query->whereNotNull('allowed_at');
                    break;
            }
        }

        $requests = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($requests);
    }

    public function store(Request $request)
    {
        $request->validate([
            'text' => 'required|string|max:1000',
        ]);

        $user = Auth::user();

        // Check if user is player
        if ($user->role !== UserRole::PLAYER) {
            return response()->json(['error' => 'Nur Spieler können Host-Anfragen stellen'], 403);
        }

        // Check if already has pending request
        $existing = HostRequest::where('user_id', $user->id)->whereNull('allowed_at')->first();
        if ($existing) {
            return response()->json(['error' => 'Du hast bereits eine ausstehende Anfrage'], 400);
        }

        $hostRequest = HostRequest::create([
            'user_id' => $user->id,
            'text' => $request->text,
        ]);

        // Send confirmation email
        Mail::to($user->email)->send(new HostRequestConfirmation($hostRequest));

        return response()->json($hostRequest, 201);
    }

    public function markAsSeen()
    {
        HostRequest::whereNull('seen_at')->update(['seen_at' => now()]);

        return response()->json(['message' => 'Anfragen als gesehen markiert']);
    }

    public function approve(Request $request, HostRequest $hostRequest)
    {
        $user = $hostRequest->user;
        $user->role = UserRole::HOST;
        $user->save();

        $hostRequest->allowed_at = now();
        $hostRequest->save();

        Mail::to($user->email)->send(new HostRequestApproved($hostRequest));

        return response()->json(['message' => 'Anfrage genehmigt']);
    }

    public function reject(Request $request, HostRequest $hostRequest)
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        Mail::to($hostRequest->user->email)->send(new HostRequestRejected($hostRequest, $request->reason));

        // Optionally delete or mark as rejected
        $hostRequest->delete();

        return response()->json(['message' => 'Anfrage abgelehnt']);
    }

    public function revoke(Request $request, HostRequest $hostRequest)
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $user = $hostRequest->user;
        if ($user->role === UserRole::HOST) {
            $user->role = UserRole::PLAYER;
            $user->save();
        }

        Mail::to($user->email)->send(new HostRequestRevoked($hostRequest, $request->reason));

        return response()->json(['message' => 'Host-Rolle zurückgenommen']);
    }
}
