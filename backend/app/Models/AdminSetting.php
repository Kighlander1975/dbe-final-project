<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminSetting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'created_from',
        'updated_from'
    ];

    /**
     * Get the user who created this setting
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_from');
    }

    /**
     * Get the user who last updated this setting
     */
    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_from');
    }

    /**
     * Get a setting value by key
     */
    public static function getValue(string $key, $default = null)
    {
        $setting = static::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    /**
     * Set a setting value
     */
    public static function setValue(string $key, $value, ?int $userId = null): static
    {
        $setting = static::where('key', $key)->first();

        if ($setting) {
            $setting->update([
                'value' => $value,
                'updated_from' => $userId
            ]);
            return $setting;
        }

        return static::create([
            'key' => $key,
            'value' => $value,
            'created_from' => $userId,
            'updated_from' => $userId
        ]);
    }
}
