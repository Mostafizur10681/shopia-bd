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
            if (!Schema::hasColumn('products', 'sales_count')) {
                $table->integer('sales_count')->default(0)->after('stock');
            }
            if (!Schema::hasColumn('products', 'attributes_config')) {
                $table->json('attributes_config')->nullable()->after('sales_count');
            }
            if (!Schema::hasColumn('products', 'status')) {
                $table->string('status')->default('In Stock')->after('attributes_config');
            }
            if (!Schema::hasColumn('products', 'unit')) {
                $table->string('unit')->nullable()->after('status');
            }
            if (!Schema::hasColumn('products', 'tax')) {
                $table->decimal('tax', 8, 2)->default(0)->after('unit');
            }
            if (!Schema::hasColumn('products', 'discount')) {
                $table->decimal('discount', 8, 2)->default(0)->after('tax');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['sales_count', 'attributes_config', 'status', 'unit', 'tax', 'discount']);
        });
    }
};
