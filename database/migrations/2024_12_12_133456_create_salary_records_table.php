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
        Schema::create('salary_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->nullable()->constrained('employees')->onDelete('set null');
            $table->date('salary_date')->nullable();
            $table->decimal('basic_salary', 10, 2);
            $table->decimal('allowances', 10, 2)->nullable();
            $table->decimal('deductions', 10, 2)->nullable();
            $table->decimal('gross_salary', 10, 2);
            $table->decimal('net_salary', 10, 2);
            $table->string('salary_from');
            $table->unsignedBigInteger('store_id');
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('store_id')->references('id')->on('stores');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salary_records');
    }
};
