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
        Schema::create('quotation_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('quotation_id'); // Links to the quotations table
            $table->unsignedBigInteger('product_id')->nullable(); // Links to products table (nullable for custom items)
            $table->string('custom_description')->nullable(); // Custom description if no product_id
            $table->decimal('price', 10, 2); // Unit price of the item
            $table->decimal('quantity', 10, 2); // Quantity of the item
            $table->decimal('cost', 10, 2)->nullable(); // Cost price (hidden for admin use)
            $table->decimal('total', 10, 2); // Total = price × quantity
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotation_items');
    }
};
