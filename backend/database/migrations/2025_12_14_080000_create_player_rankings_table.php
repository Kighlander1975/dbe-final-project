<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('player_rankings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('game_id')->constrained('games')->onDelete('cascade');
            $table->tinyInteger('player_count'); // Anzahl Spieler im Spiel
            $table->tinyInteger('final_rank'); // Endplatzierung (1-basiert)
            $table->smallInteger('points_earned'); // Erhaltene Punkte
            $table->timestamp('created_at')->useCurrent();

            // Indizes für Performance
            $table->index(['user_id', 'created_at']);
            $table->index('game_id');
            $table->unique(['user_id', 'game_id']); // Ein Eintrag pro Spieler pro Spiel
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('player_rankings');
    }
};