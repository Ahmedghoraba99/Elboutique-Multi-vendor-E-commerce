<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class attributes extends Model
{
    protected $fillable = [
        'color',
        'weight',
        'height',
        'width',
        'length',
        'material',
        'size',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_attributes')->withPivot([
            'color',
            'size',
            'weight',
            'width',
            'height',
            'material'
        ]);
    }

    use HasFactory;
}
