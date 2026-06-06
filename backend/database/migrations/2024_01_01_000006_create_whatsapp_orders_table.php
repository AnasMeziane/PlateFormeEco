<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('whatsapp_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->dateTime('order_date');
            $table->string('status')->default('pending');
            $table->text('message_sent')->nullable();
            $table->timestamps();
        });

        // Pivot table for WhatsAppOrder <-> Product (many-to-many)
        Schema::create('whatsapp_order_product', function (Blueprint $table) {
            $table->id();
            $table->foreignId('whatsapp_order_id')->constrained('whatsapp_orders')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->integer('quantity')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('whatsapp_order_product');
        Schema::dropIfExists('whatsapp_orders');
    }
};
