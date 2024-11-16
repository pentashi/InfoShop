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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255); // Product Name
            $table->text('description')->nullable(); // Product Description
            $table->string('sku', 100)->nullable()->unique(); // Unique SKU
            $table->string('barcode', 100)->nullable()->unique(); // Unique Barcode
            $table->string('image_url', 255)->nullable(); // Product Image URL
            $table->string('unit', 10); // Km/Litre/Box
            $table->integer('brand_id')->nullable(); // Brand ID (integer)
            $table->integer('category_id')->nullable(); // Category ID (integer)
            $table->string('product_type', 50)->default('simple')->nullable();
            $table->decimal('discount', 10, 2)->default(0); // Discount of product in stock
            $table->decimal('quantity', 10, 2)->default(0); // Quantity of product in stock
            $table->decimal('alert_quantity', 10, 2)->default(5); // Minimum stock threshold for alerts
            $table->boolean('is_stock_managed')->default(true); // Indicates if stock management is enabled
            $table->boolean('is_active')->default(true); // Product Active Status, default to true
            $table->boolean('is_featured')->default(false); // Product Featured Status, default to false
            $table->integer('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
