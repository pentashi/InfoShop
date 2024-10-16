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
        Schema::create('purchase_transactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('store_id');
            $table->unsignedBigInteger('purchase_id')->nullable();
            $table->unsignedBigInteger('contact_id');
            $table->dateTime('transaction_date');
            $table->decimal('amount', 10, 2);
            $table->string('payment_method');
            $table->string('transaction_type'); // 'purchase', 'opening_balance', 'account_deposit'
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_transactions');
    }
};
