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
        Schema::create('admin_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key', 200)->unique();
            $table->text('value')->nullable();
            $table->unsignedBigInteger('created_from')->nullable(); // Nullable, kein Constraint
            $table->unsignedBigInteger('updated_from')->nullable(); // Nullable, kein Constraint
            $table->timestamps();

            // Index für Performance
            $table->index('key');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_settings');
    }
};
