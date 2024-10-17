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
        Schema::create('quantity_adjustments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('batch_id');
            $table->unsignedBigInteger('stock_id');
            $table->integer('previous_quantity'); // The quantity before the adjustment
            $table->integer('adjusted_quantity'); // The new adjusted quantity
            $table->string('reason')->nullable(); // Optional reason for the adjustment
            $table->unsignedBigInteger('created_by');
            $table->timestamps();

            $table->foreign('batch_id')->references('id')->on('product_batches');
            $table->foreign('stock_id')->references('id')->on('product_stocks');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quantity_adjustments');
    }
};
