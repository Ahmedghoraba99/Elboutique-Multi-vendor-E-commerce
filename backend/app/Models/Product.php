<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'price',
        'images',
        'tags',
        'category_id',
        'vendor_id',
        'description',
        'price',
        'stock',
        'category_id',
        'vendor_id',
        'is_featured'
    ];
    protected $table = 'products';

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function images()
    {
        return $this->hasMany(product_images::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }
    public function attributes()
    {
        return $this->belongsToMany(Attributes::class)->withPivot([
            'color',
            'size',
            'weight',
            'width',
            'height',
            'material',
            'size'
        ]);
    }
    public function orders()
    {
        return $this->belongsToMany(Order::class)->withPivot('quantity');
    }
    
    public function cartCustomers(){
        return $this->belongsToMany(Customer::class,'cart')->withPivot('quantity');
    }
    public function wishlistCustomers(){
        return $this->belongsToMany(Customer::class,'wishlists');
    }
    use HasFactory;
}