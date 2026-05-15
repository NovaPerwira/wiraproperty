<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('availability_blocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->nullable()->constrained()->cascadeOnDelete();
            $table->date('start_date');
            $table->date('end_date');
            $table->string('reason')->nullable(); // maintenance, owner-stay, event, etc.
            $table->string('type')->default('block'); // block, maintenance
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['room_id', 'start_date', 'end_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('availability_blocks');
    }
};
