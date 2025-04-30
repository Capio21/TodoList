<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\greenprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (greenprint $table) {
            $table->id();
            $table->string('username')->unique();
            $table->string('email')->unique();
            $table->string('password');
            $table->string('authToken')->nullable(); // Add authToken field
            $table->string('profile_image')->nullable(); // Add profile_image field
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
