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
        Schema::create('sale_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sale_id'); // Sale ID without foreign key constraint
            $table->unsignedBigInteger('product_id')->nullable(); // Product ID without foreign key constraint
            $table->unsignedBigInteger('batch_id')->nullable(); // Batch ID without foreign key constraint
            $table->string('description')->nullable();
            $table->date('sale_date');
            $table->integer('quantity'); // Quantity sold
            $table->decimal('unit_price', 10, 2); // Sale price per unit
            $table->decimal('unit_cost', 10, 2); // Cost price per unit
            $table->decimal('discount', 10, 2)->default(0); // Discount applied to this item
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('sale_id')->references('id')->on('sales');
            $table->foreign('product_id')->references('id')->on('products');
            $table->foreign('batch_id')->references('id')->on('product_batches');
            $table->foreign('created_by')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sale_items');
    }
};
