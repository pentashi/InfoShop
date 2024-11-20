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
            $table->unsignedBigInteger('purchase_id'); // Purchase ID (link to the purchase table)
            $table->unsignedBigInteger('product_id')->nullable(); // Product ID (link to the product table)
            $table->unsignedBigInteger('batch_id')->nullable(); // Batch ID (to track inventory batches)
            $table->string('description')->nullable();
            $table->date('purchase_date');
            $table->decimal('quantity',10,2); // Quantity purchased
            $table->decimal('unit_price', 10, 2); // Purchase price per unit
            $table->decimal('unit_cost', 10, 2); // Cost price per unit (if different from unit price, e.g., after tax)
            $table->decimal('discount', 10, 2)->default(0);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('purchase_id')->references('id')->on('purchases');
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
        Schema::dropIfExists('purchase_items');
    }
};
