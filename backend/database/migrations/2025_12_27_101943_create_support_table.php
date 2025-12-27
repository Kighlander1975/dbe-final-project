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
        Schema::create('support', function (Blueprint $table) {
            $table->id();
            $table->enum('status', ['offen', 'gelesen', 'in Bearbeitung', 'Fehlmeldung', 'geschlossen'])->default('offen');
            $table->enum('title', ['Bug gefunden', 'Login-/Registrierungsproblem', 'sonstiges Problem', 'Nachricht an Admin']);
            $table->enum('urgency', ['1 - notice', '2 - info', '3 - warning', '4 - danger'])->default('2 - info');
            $table->string('email');
            $table->text('message');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('support');
    }
};
