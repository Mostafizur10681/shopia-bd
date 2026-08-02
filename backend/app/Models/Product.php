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
        'sales_count',
        'attributes_config',
        'status',
        'unit',
        'tax',
        'discount',
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
        'sub_category',
        'brand',
        'cost_price',
        'is_organic',
        'meta_title',
        'meta_description',
        'meta_keywords',
    ];

    protected $casts = [
        'gallery_images' => 'array',
        'attributes_config' => 'array',
        'is_bestseller' => 'boolean',
        'is_new' => 'boolean',
        'is_sale' => 'boolean',
        'is_featured' => 'boolean',
        'is_organic' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }
}
