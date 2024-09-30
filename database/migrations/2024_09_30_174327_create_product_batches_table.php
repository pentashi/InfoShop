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
        Schema::create('product_batches', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('product_id'); // Using unsignedInteger for product_id
            $table->string('batch_number')->default('DEFAULT'); // Default batch code
            $table->date('expiry_date')->nullable(); // Nullable expiry date
            $table->decimal('cost', 10, 2); // Cost price
            $table->decimal('price', 10, 2); // Sale price
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_batches');
    }
};
