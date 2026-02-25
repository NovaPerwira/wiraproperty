<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('housekeeping_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->constrained()->cascadeOnDelete();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('booking_id')->nullable()->constrained()->nullOnDelete(); // source booking

            $table->enum('task_type', ['cleaning', 'inspection', 'maintenance', 'turndown'])
                ->default('cleaning');
            $table->enum('status', ['pending', 'in_progress', 'done', 'skipped'])
                ->default('pending');
            $table->enum('priority', ['normal', 'urgent'])->default('normal');

            $table->text('notes')->nullable();
            $table->date('scheduled_for');
            $table->timestamp('completed_at')->nullable();

            $table->timestamps();

            $table->index('room_id');
            $table->index('status');
            $table->index('scheduled_for');
            $table->index('assigned_to');
            $table->index(['scheduled_for', 'status']); // board query
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('housekeeping_tasks');
    }
};
