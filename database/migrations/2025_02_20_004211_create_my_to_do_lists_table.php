<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('my_to_do_lists', function (Blueprint $table) {
            $table->id();
            $table->string('mytodolist_title');
            $table->text('description')->nullable();
            $table->time('time');
            $table->date('date');
            $table->enum('status', ['pending', 'done', 'overdue'])->default('pending');
            $table->boolean('archived')->default(false);
            $table->timestamps();

            
        });
    }
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('my_to_do_lists');
    }
};
