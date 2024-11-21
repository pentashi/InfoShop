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
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->unsignedBigInteger('sales_id')->nullable(); // Unique identifier for the sale
            $table->unsignedBigInteger('store_id'); // ID of the store
            $table->unsignedBigInteger('contact_id'); // ID of the customer
            $table->date('transaction_date'); // Date and time of the transaction
            $table->decimal('amount', 10, 2); // amount paid
            $table->string('payment_method'); // Payment method
            $table->string('transaction_type'); // 'purchase', 'opening_balance', 'account'
            $table->string('note')->nullable();
            $table->integer('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('sales_id')->references('id')->on('sales');
            $table->foreign('store_id')->references('id')->on('stores');
            $table->foreign('contact_id')->references('id')->on('contacts');
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
