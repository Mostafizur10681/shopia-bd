<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $c = App\Models\Category::create([
        'name' => 'Test Electronics ' . rand(100, 999),
        'slug' => 'test-electronics-' . time(),
        'description' => 'Gadgets & Devices',
        'is_active' => true
    ]);
    echo "SUCCESS: Created category ID " . $c->id . "\n";
    echo "TOTAL CATEGORIES: " . App\Models\Category::count() . "\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
