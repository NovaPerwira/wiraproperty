<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('guests', function (Blueprint $table) {
            $table->id();

            // Identity
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone');
            $table->string('address')->nullable();
            $table->string('id_number')->unique()->nullable(); // KTP / Passport
            $table->string('nationality')->default('Indonesia');
            $table->date('date_of_birth')->nullable();

            // Preferences (non-smoking, honeymoon, etc.)
            $table->json('preferences')->nullable();

            // Staff notes
            $table->text('notes')->nullable();

            // Spam / blacklist protection
            $table->boolean('is_blacklisted')->default(false);
            $table->text('blacklist_reason')->nullable();

            // Denormalized counters (updated via observer)
            $table->unsignedInteger('total_bookings')->default(0);
            $table->decimal('total_spend', 12, 2)->default(0);

            $table->timestamps();
            $table->softDeletes();

            $table->index('is_blacklisted');
            $table->index('email');
            $table->index('phone');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guests');
    }
};
