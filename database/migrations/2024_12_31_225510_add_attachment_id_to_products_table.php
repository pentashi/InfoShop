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
        Schema::table('products', function (Blueprint $table) {
            $table->unsignedBigInteger('attachment_id')->nullable()->after('image_url'); // New column
            $table->foreign('attachment_id')->references('id')->on('attachments')->onDelete('set null'); // Foreign key
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['attachment_id']);
            $table->dropColumn('attachment_id');
        });
    }
};
