<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'customer_name',
        'product_id',
        'comment',
        'rating',
        'status',
        'image'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
