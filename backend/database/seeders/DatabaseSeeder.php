<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Default Admin User
        $admin = User::firstOrCreate(
            ['email' => 'admin@shopia.com'],
            [
                'name' => 'Abir',
                'password' => Hash::make('password123'),
                'role' => 'Super Admin',
                'phone' => '01681-135030',
                'address' => 'Dhaka, Bangladesh',
            ]
        );

        // 2. Create Sample Customer User
        $customer = User::firstOrCreate(
            ['email' => 'customer@shopia.com'],
            [
                'name' => 'Md Mostafizur Rahman',
                'password' => Hash::make('password123'),
                'role' => 'customer',
                'phone' => '01711-000000',
                'address' => 'Mohammadpur, Dhaka 1207',
            ]
        );

        // 3. Create Default Categories
        $catOrganic = Category::firstOrCreate(
            ['slug' => 'organic-food'],
            ['name' => 'Organic Food', 'description' => '100% natural and chemical free food items']
        );

        $catSkinCare = Category::firstOrCreate(
            ['slug' => 'skin-care'],
            ['name' => 'Skin Care', 'description' => 'Natural organic oils and beauty products']
        );

        // 4. Create Sample Products
        $prodMaca = Product::firstOrCreate(
            ['slug' => 'organic-black-maca-powder-300gm'],
            [
                'name' => 'Organic Black Maca Powder (300 gm)',
                'sku' => 'BLK-MACA-300',
                'category_id' => $catOrganic->id,
                'price' => 1450.00,
                'original_price' => 1750.00,
                'discount_percentage' => 17,
                'stock' => 100,
                'short_description' => 'Pure organic gelatinized black maca root powder imported from Peru.',
                'description' => 'Boosts energy, stamina, endurance, and revitalizes natural health.',
                'main_image' => '/prod_maca.png',
                'is_bestseller' => true,
                'is_new' => true,
                'rating' => 5.00,
                'reviews_count' => 24,
            ]
        );

        $prodOil = Product::firstOrCreate(
            ['slug' => 'mustard-oil-sorishar-tel'],
            [
                'name' => 'Mustard Oil (সরিষার তেল 1 Ltr)',
                'sku' => 'MUSTARD-OIL-1L',
                'category_id' => $catOrganic->id,
                'price' => 300.00,
                'original_price' => 350.00,
                'discount_percentage' => 14,
                'stock' => 80,
                'short_description' => '100% Cold pressed virgin mustard oil.',
                'description' => 'Pure cold pressed mustard oil produced from selected organic seeds.',
                'main_image' => '/prod_blackseed.png',
                'is_bestseller' => true,
                'rating' => 4.90,
                'reviews_count' => 18,
            ]
        );

        // 5. Create Sample Orders
        $order1 = Order::firstOrCreate(
            ['order_number' => 'ORD-1001'],
            [
                'user_id' => $customer->id,
                'customer_name' => 'Md Mostafizur Rahman',
                'customer_email' => 'customer@shopia.com',
                'customer_phone' => '01711-000000',
                'district' => 'Dhaka',
                'shipping_address' => 'House 41/1, Sher-E-Bangla Road, Mohammadpur, Dhaka 1207',
                'subtotal' => 1450.00,
                'shipping_fee' => 60.00,
                'grand_total' => 1510.00,
                'payment_method' => 'cod',
                'status' => 'Packed',
                'is_paid' => false,
            ]
        );

        OrderItem::firstOrCreate(
            ['order_id' => $order1->id, 'product_id' => $prodMaca->id],
            [
                'product_name' => $prodMaca->name,
                'unit_price' => 1450.00,
                'quantity' => 1,
                'total_price' => 1450.00,
            ]
        );
    }
}
