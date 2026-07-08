<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add combo_enabled flag to products
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('combo_deal')->default(false)->after('wholesale_product');
        });

        // Add combo_colors to carts (stores JSON array of selected color names)
        Schema::table('carts', function (Blueprint $table) {
            $table->text('combo_colors')->nullable()->after('variation');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('combo_deal');
        });
        Schema::table('carts', function (Blueprint $table) {
            $table->dropColumn('combo_colors');
        });
    }
};
