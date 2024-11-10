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
        Schema::create('cash_logs', function (Blueprint $table) {
            $table->id();
            $table->date('transaction_date');  // Date and time of transaction
            $table->enum('transaction_type', ['cash_in', 'cash_out']);  // Type of transaction
            $table->decimal('amount', 10, 2);  // Cash amount
            $table->enum('source', ['sales', 'purchases', 'expenses', 'deposit', 'withdrawal', 'other']);
            $table->string('description')->nullable();  // Description of the transaction
            $table->unsignedBigInteger('store_id');
            $table->unsignedBigInteger('contact_id')->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();  // Created at and updated at timestamps
            $table->softDeletes();

            $table->foreign('store_id')->references('id')->on('stores');
            $table->foreign('created_by')->references('id')->on('users');
            $table->foreign('contact_id')->references('id')->on('contacts');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cash_logs');
    }
};
