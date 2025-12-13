<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HostRequest extends Model
{
    protected $fillable = ['user_id', 'text', 'seen_at', 'allowed_at'];

    protected $casts = [
        'seen_at' => 'datetime',
        'allowed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
