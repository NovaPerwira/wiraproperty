<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('room_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');               // Standard, Deluxe, Suite, Family
            $table->text('description')->nullable();
            $table->decimal('base_price', 10, 2); // price per night
            $table->unsignedTinyInteger('capacity')->default(2);
            $table->json('amenities')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('room_types');
    }
};
