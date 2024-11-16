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
        Schema::create('reload_and_bill_metas', function (Blueprint $table) {
            $table->id(); // Auto-incrementing ID for the payment transaction
            $table->foreignId('sale_item_id')->constrained()->onDelete('cascade'); // Foreign key to SaleItem
            $table->string('transaction_type'); // Type of transaction (recharge, electricity, water, etc.)
            $table->string('account_number'); // Account number related to the transaction (e.g., mobile number, utility account)
            $table->decimal('commission', 10, 2)->default(0); // Primary commission earned
            $table->decimal('additional_commission', 10, 2)->default(0); // Additional commission (bonus/incentive)
            $table->text('description')->nullable(); // Optional description for additional details
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reload_and_bill_metas');
    }
};
