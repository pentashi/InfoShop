<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('collections', function (Blueprint $table) {
            $table->id();
            $table->string('collection_type', 50); // Collection type (e.g., 'category', 'brand', 'tag')
            $table->string('name', 255); // Collection name
            $table->text('description')->nullable(); // Optional description
            $table->integer('parent_id')->nullable(); // Optional parent_id for hierarchical structure
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('collections');
    }
};
