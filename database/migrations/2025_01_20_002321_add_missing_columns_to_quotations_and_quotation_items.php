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
        Schema::table('quotations', function (Blueprint $table) {
            $table->unsignedBigInteger('store_id')->nullable()->after('id'); // Adjust position with 'after' if needed
        });

        Schema::table('quotation_items', function (Blueprint $table) {
            $table->unsignedBigInteger('batch_id')->nullable()->after('product_id'); // Adjust position with 'after' if needed
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quotations', function (Blueprint $table) {
            $table->dropColumn('store_id');
        });

        Schema::table('quotation_items', function (Blueprint $table) {
            $table->dropColumn('batch_id');
        });
    }
};
