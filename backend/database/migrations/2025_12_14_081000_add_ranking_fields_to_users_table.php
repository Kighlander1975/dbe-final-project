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
        Schema::table('users', function (Blueprint $table) {
            $table->integer('total_ranking_points')->default(0)->after('email_verified_at');
            $table->integer('games_played')->default(0)->after('total_ranking_points');
            $table->tinyInteger('best_placement')->nullable()->after('games_played');
            $table->decimal('current_rating', 6, 2)->default(1200.00)->after('best_placement');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['total_ranking_points', 'games_played', 'best_placement', 'current_rating']);
        });
    }
};