<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->cascadeOnDelete();
            $table->foreignId('recorded_by')->nullable()->constrained('users')->nullOnDelete();

            $table->decimal('amount', 10, 2);
            $table->enum('payment_method', ['cash', 'transfer', 'credit_card', 'debit_card', 'ota'])
                ->default('cash');
            $table->enum('payment_status', ['pending', 'paid', 'partial', 'refunded'])
                ->default('pending');
            $table->timestamp('paid_at')->nullable();
            $table->string('reference_number')->nullable(); // bank ref / OTA confirmation
            $table->text('notes')->nullable();

            $table->timestamps();

            $table->index('booking_id');
            $table->index('payment_status');
            $table->index('paid_at');
            $table->index('payment_method');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
