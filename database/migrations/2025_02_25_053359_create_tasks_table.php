<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\greenprint;
use Illuminate\Support\Facades\Schema;

class CreateTasksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tasks', function (greenprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->timestamp('time_started')->nullable();
            $table->timestamp('time_ended')->nullable();
            $table->timestamp('deadline')->nullable();
            $table->enum('status', ['pending', 'canceled', 'complete', 'overdue'])->default('pending');
            $table->string('tags')->nullable(); // You could make this a JSON column if you plan to have multiple tags
            $table->timestamps();
            $table->boolean('archived')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tasks');
        $table->dropColumn('archived'); 
    }
}
