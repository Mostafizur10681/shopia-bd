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
            $table->string('sub_category')->nullable()->after('category_id');
            $table->string('brand')->nullable()->after('sub_category');
            $table->decimal('cost_price', 10, 2)->nullable()->after('original_price');
            $table->boolean('is_organic')->default(false)->after('is_featured');
            $table->string('meta_title')->nullable()->after('rating');
            $table->text('meta_description')->nullable()->after('meta_title');
            $table->string('meta_keywords')->nullable()->after('meta_description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'sub_category',
                'brand',
                'cost_price',
                'is_organic',
                'meta_title',
                'meta_description',
                'meta_keywords',
            ]);
        });
    }
};
