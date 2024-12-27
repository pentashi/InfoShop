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
        Schema::table('salary_records', function (Blueprint $table) {
             // Adding the 'remarks' column
             $table->text('remarks')->nullable()->after('net_salary')->comment('Additional notes about the salary record.');

             // Adding the 'adjusts_balance' column
             $table->boolean('adjusts_balance')->default(false)->after('remarks')->comment('Whether this salary record adjusts the pending balance.');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('salary_records', function (Blueprint $table) {
            // Drop the columns if rolling back
            $table->dropColumn('remarks');
            $table->dropColumn('adjusts_balance');
        });
    }
};
