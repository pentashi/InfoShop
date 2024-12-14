<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Artisan;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Contact's name (applies to both customers and vendors)
            $table->string('email')->nullable(); // Unique email
            $table->string('phone')->nullable(); // Phone number
            $table->string('whatsapp')->nullable(); // Phone number
            $table->string('address')->nullable(); // Street address
            $table->decimal('balance', 10, 2)->default(0.00); // Account balance
            $table->decimal('loyalty_points', 10, 2)->nullable(); // Loyalty points for customers (nullable for vendors)
            $table->enum('type', ['customer', 'vendor']); // Type column to distinguish between customer and vendor
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
        Schema::dropIfExists('contacts');
    }
};
