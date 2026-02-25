<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();

            // Guest details
            $table->string('guest_name');
            $table->string('guest_email');
            $table->string('guest_phone');
            $table->string('guest_address')->nullable();

            // Stay dates
            $table->date('check_in_date');
            $table->date('check_out_date');

            // Status & source
            $table->enum('status', ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'])
                ->default('pending');
            $table->enum('booking_source', ['direct', 'ota', 'walk_in'])->default('direct');

            // Financials
            $table->decimal('total_amount', 10, 2)->default(0);

            $table->text('special_requests')->nullable();
            $table->timestamps();

            // Optimized indexes
            $table->index('status');
            $table->index('booking_source');
            $table->index('check_in_date');
            $table->index('check_out_date');
            $table->index('room_id');
            $table->index(['check_in_date', 'check_out_date']); // for range queries
            $table->index(['room_id', 'check_in_date', 'check_out_date']); // for availability check
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
