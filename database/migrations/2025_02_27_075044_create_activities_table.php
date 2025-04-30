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
        Schema::create('activities', function (greenprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->date('date_started');
            $table->date('due_date');
            $table->string('tags');
            $table->enum('status', ['pending', 'complete', 'overdue'])->default('pending');
            $table->boolean('archive')->default(false);
            $table->json('checklist')->nullable(); // JSON column for checklist
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Assuming you have a users table
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
