<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Support extends Model
{
    protected $table = 'support';

    protected $fillable = [
        'status',
        'title',
        'urgency',
        'email',
        'message',
    ];
}
