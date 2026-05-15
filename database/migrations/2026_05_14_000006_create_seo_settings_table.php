<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seo_settings', function (Blueprint $table) {
            $table->id();
            $table->string('page_key')->unique(); // home, about, stays, gallery, etc.
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->text('keywords')->nullable();
            $table->string('og_title')->nullable();
            $table->text('og_description')->nullable();
            $table->string('og_image')->nullable();
            $table->string('canonical_url')->nullable();
            $table->json('schema_markup')->nullable(); // JSON-LD
            $table->string('robots')->default('index, follow');
            $table->timestamps();
        });

        // Global settings
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type')->default('string'); // string, boolean, json, image
            $table->string('group')->default('general'); // general, contact, social, analytics
            $table->string('label')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seo_settings');
        Schema::dropIfExists('site_settings');
    }
};
