<?php
// app/Providers/UserRole.php
namespace App;

enum UserRole: string
{
    case PLAYER = 'player';
    case ADMIN = 'admin';
    case BANNED = 'banned';

    /**
     * Get all role values
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get role label for display
     */
    public function label(): string
    {
        return match ($this) {
            self::PLAYER => 'Spieler',
            self::ADMIN => 'Administrator',
            self::BANNED => 'Gesperrt',
        };
    }

    /**
     * Check if role is admin
     */
    public function isAdmin(): bool
    {
        return $this === self::ADMIN;
    }

    /**
     * Check if role is player
     */
    public function isPlayer(): bool
    {
        return $this === self::PLAYER;
    }

    /**
     * Check if user is banned
     */
    public function isBanned(): bool
    {
        return $this === self::BANNED;
    }

    /**
     * Check if role can access admin panel
     */
    public function canAccessAdmin(): bool
    {
        return $this === self::ADMIN;
    }
}
