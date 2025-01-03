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
        Schema::create('cheques', function (Blueprint $table) {
            $table->id();
            $table->string('cheque_number');
            $table->date('cheque_date');
            $table->string('name');
            $table->decimal('amount', 15, 2); // Precision for currency
            $table->date('issued_date');
            $table->string('bank')->nullable();
            $table->string('status'); // Example: pending, cleared, canceled
            $table->text('remark')->nullable();
            $table->enum('direction', ['issued', 'received']); // issued = cheque from me, received = cheque for me
            $table->unsignedBigInteger('store_id'); // Foreign key for stores
            $table->unsignedBigInteger('created_by'); // Foreign key for the user who created the record
            $table->softDeletes(); // Adds `deleted_at` column for soft deletes
            $table->timestamps();

            // Add foreign key constraints
            $table->foreign('store_id')->references('id')->on('stores')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cheques');
    }
};
