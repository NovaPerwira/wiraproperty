<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_type_id')->constrained()->cascadeOnDelete();
            $table->string('room_number', 10)->unique();
            $table->unsignedTinyInteger('floor')->default(1);
            // Static status: physical state. Availability is DYNAMIC — computed
            // from bookings: a room is "booked" if an active booking overlaps a date range.
            $table->enum('status', ['available', 'maintenance'])->default('available');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('room_type_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
