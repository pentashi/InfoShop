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
        Schema::create('attachments', function (Blueprint $table) {
            $table->id();
            $table->string('path'); // File path or URL
            $table->string('file_name')->nullable();
            $table->string('attachment_type')->nullable();
            $table->unsignedBigInteger('size')->nullable();
            $table->string('alt_text')->nullable(); // Alternative text for accessibility
            $table->string('title')->nullable(); // Title of the attachment
            $table->text('description')->nullable(); // Description or caption
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attachments');
    }
};
