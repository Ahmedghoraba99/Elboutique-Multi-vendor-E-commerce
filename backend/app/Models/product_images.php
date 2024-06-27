<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Product;

class product_images extends Model
{
    use HasFactory;
    public $timestamps = false;

    protected $fillable = ['product_id', 'image'];
    protected $appends = ['image_url'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // Accessor to get the image URL
    public function getImageUrlAttribute()
    {
        return url('storage/' . $this->image);
    }
}
