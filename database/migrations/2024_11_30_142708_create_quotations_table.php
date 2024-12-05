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
        Schema::create('quotations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('contact_id'); // Links to contacts table (customer)
            $table->string('quotation_number')->unique(); // Unique number for the quotation
            $table->date('quotation_date'); // Date of issue
            $table->date('expiry_date')->nullable(); // Expiry date (nullable)
            $table->string('quotation_terms')->nullable(); // Payment/validity terms (nullable)
            $table->string('subject')->nullable(); // Optional subject/title
            $table->decimal('subtotal', 10, 2); // Sum of items' total before discount
            $table->decimal('discount', 10, 2)->default(0.00); // Discount applied
            $table->decimal('total', 10, 2); // Final total after discount
            $table->decimal('profit', 10, 2)->default(0.00); // Final total after discount
            $table->text('customer_notes')->nullable(); // Notes visible to the customer
            $table->text('terms_conditions')->nullable(); // Additional T&C for the quotation
            $table->json('custom_fields')->nullable();
            $table->integer('created_by')->nullable(); // User who created the quotation
            $table->softDeletes(); // Supports soft deletion
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotations');
    }
};
