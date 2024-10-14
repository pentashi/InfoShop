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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sales_id')->nullable(); // Unique identifier for the sale
            $table->unsignedBigInteger('store_id'); // ID of the store
            $table->unsignedBigInteger('customer_id'); // ID of the customer
            $table->timestamp('transaction_date'); // Date and time of the transaction
            $table->decimal('amount', 10, 2); // amount paid
            $table->string('payment_method'); // Payment method
            $table->string('transaction_type'); // 'purchase', 'opening_balance', 'account_deposit'
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
