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
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('store_id'); // Store ID without foreign key constraint
            $table->unsignedBigInteger('contact_id');
            $table->timestamp('sale_date')->useCurrent(); // Sale date
            $table->decimal('total_amount', 10, 2); //Net total (total after discount)
            $table->decimal('discount', 10, 2)->default(0); // Discount
            $table->decimal('amount_received', 10, 2); // Amount received
            $table->decimal('profit_amount', 10, 2)->default(0);
            $table->string('status'); //['completed', 'pending', 'refunded']
            $table->text('note')->nullable();
            $table->timestamps();

            $table->foreign('store_id')->references('id')->on('stores');
            $table->foreign('contact_id')->references('id')->on('contacts');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
