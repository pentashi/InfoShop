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
            $table->integer('sale_id'); // Sale ID without foreign key constraint
            $table->integer('product_id'); // Product ID without foreign key constraint
            $table->integer('batch_id'); // Batch ID without foreign key constraint
            $table->integer('quantity'); // Quantity sold
            $table->decimal('unit_price', 10, 2); // Sale price per unit
            $table->decimal('unit_cost', 10, 2); // Cost price per unit
            $table->decimal('discount', 10, 2)->default(0); // Discount applied to this item
            $table->timestamps();
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
