<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\UserRole;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Ändert den Default der user role von 'player' zu 'host'
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')
                ->default(UserRole::HOST->value)
                ->change();
        });
    }

    /**
     * Reverse the migrations.
     * Setzt den Default zurück zu 'player'
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')
                ->default(UserRole::PLAYER->value)
                ->change();
        });
    }
};
