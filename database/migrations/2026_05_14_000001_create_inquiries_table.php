<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inquiries', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('subject')->nullable();
            $table->text('message');
            $table->string('status')->default('new'); // new, read, replied, archived
            $table->string('source')->default('website'); // website, whatsapp, email
            $table->foreignId('room_id')->nullable()->constrained()->nullOnDelete();
            $table->date('check_in')->nullable();
            $table->date('check_out')->nullable();
            $table->unsignedTinyInteger('guests')->default(1);
            $table->text('admin_notes')->nullable();
            $table->timestamp('replied_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inquiries');
    }
};
