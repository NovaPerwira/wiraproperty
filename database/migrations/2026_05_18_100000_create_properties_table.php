<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category'); // villa, rumah, ruko, tanah
            $table->string('location')->nullable();
            $table->string('price_formatted')->nullable();
            $table->string('size')->nullable();
            $table->integer('beds')->nullable();
            $table->integer('baths')->nullable();
            $table->string('zoning')->nullable();
            $table->decimal('rating', 3, 1)->default(5.0);
            $table->string('tag')->nullable();
            $table->string('main_image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
