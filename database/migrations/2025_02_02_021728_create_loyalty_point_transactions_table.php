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
        Schema::create('loyalty_point_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contact_id')->constrained('contacts')->onDelete('cascade'); // Links to the contacts table
            $table->foreignId('store_id')->constrained('stores')->onDelete('cascade'); // Links to the stores table
            $table->decimal('points'); // Points earned or redeemed
            $table->enum('type', ['earn', 'redeem', 'expire', 'manual_adjustment']); // Type of transaction
            $table->string('description')->nullable(); // Additional details
            $table->dateTime('expires_at')->nullable(); // Expiry date for earned points
            $table->unsignedBigInteger('reference_id')->nullable(); // Reference ID (e.g., order ID)
            $table->unsignedBigInteger('created_by'); // Foreign key for the user who created the record
            $table->softDeletes();
            $table->timestamps(); // created_at and updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loyalty_point_transactions');
    }
};
