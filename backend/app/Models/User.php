<?php

namespace App\Models;

use App\UserRole;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',                          // ⭐ NEU
        'email_verification_token',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'email_verification_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,      // ⭐ NEU: Enum Cast
        ];
    }

    // ========================================
    // 🎯 Role Helper Methods
    // ========================================

    /**
     * Check if user is admin
     */
    public function isAdmin(): bool
    {
        return $this->role === UserRole::ADMIN;
    }

    /**
     * Check if user is player
     */
    public function isPlayer(): bool
    {
        return $this->role === UserRole::PLAYER;
    }

    /**
     * Check if user is banned
     */
    public function isBanned(): bool
    {
        return $this->role === UserRole::BANNED;
    }

    /**
     * Check if user can access admin panel
     */
    public function canAccessAdmin(): bool
    {
        return $this->role->canAccessAdmin();
    }

    /**
     * Check if user has specific role
     */
    public function hasRole(UserRole $role): bool
    {
        return $this->role === $role;
    }

    /**
     * Check if user has any of the given roles
     */
    public function hasAnyRole(array $roles): bool
    {
        return in_array($this->role, $roles);
    }

    /**
     * Set user role
     */
    public function setRole(UserRole $role): void
    {
        $this->role = $role;
        $this->save();
    }

    /**
     * Get role label
     */
    public function getRoleLabel(): string
    {
        return $this->role->label();
    }

    /**
     * Scope: Only admins
     */
    public function scopeAdmins($query)
    {
        return $query->where('role', UserRole::ADMIN->value);
    }

    /**
     * Scope: Only players
     */
    public function scopePlayers($query)
    {
        return $query->where('role', UserRole::PLAYER->value);
    }

    /**
     * Scope: Only banned users
     */
    public function scopeBanned($query)
    {
        return $query->where('role', UserRole::BANNED->value);
    }

    /**
     * Scope: Active users (not banned)
     */
    public function scopeActive($query)
    {
        return $query->where('role', '!=', UserRole::BANNED->value);
    }
}
