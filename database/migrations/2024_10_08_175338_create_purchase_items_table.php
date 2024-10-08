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
        Schema::create('purchase_items', function (Blueprint $table) {
            $table->id();
            $table->integer('purchase_id'); // Purchase ID (link to the purchase table)
            $table->integer('product_id'); // Product ID (link to the product table)
            $table->integer('batch_id'); // Batch ID (to track inventory batches)
            $table->integer('quantity'); // Quantity purchased
            $table->decimal('unit_price', 10, 2); // Purchase price per unit
            $table->decimal('unit_cost', 10, 2); // Cost price per unit (if different from unit price, e.g., after tax)
            $table->decimal('discount', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_items');
    }
};
