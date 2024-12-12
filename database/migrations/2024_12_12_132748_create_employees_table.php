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
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('store_id');
            $table->string('name');
            $table->string('contact_number')->nullable();
            $table->text('address')->nullable();
            $table->date('joined_at');
            $table->decimal('salary', 10, 2);
            $table->string('salary_frequency'); // e.g., monthly, annually
            $table->string('role');
            $table->string('status'); // e.g., active, inactive
            $table->string('gender');
            $table->decimal('balance', 10, 2)->default(0);
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->softDeletes(); // for soft deleting
            $table->timestamps();

            $table->foreign('store_id')->references('id')->on('stores');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
