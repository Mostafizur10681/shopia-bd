<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $product = \App\Models\Product::create([
        'name' => 'test test test',
        'price' => 10,
        'stock' => 5,
        'category_id' => 1
    ]);
    echo "SUCCESS: " . $product->id;
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage();
}
