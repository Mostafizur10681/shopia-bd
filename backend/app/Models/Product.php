<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'sku',
        'category_id',
        'price',
        'original_price',
        'discount_percentage',
        'stock',
        'short_description',
        'description',
        'main_image',
        'gallery_images',
        'is_bestseller',
        'is_new',
        'is_sale',
        'is_featured',
        'rating',
        'reviews_count',
    ];

    protected $casts = [
        'gallery_images' => 'array',
        'is_bestseller' => 'boolean',
        'is_new' => 'boolean',
        'is_sale' => 'boolean',
        'is_featured' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
