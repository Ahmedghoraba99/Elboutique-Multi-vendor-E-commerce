<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attributes extends Model
{
    protected $fillable = [
        'product_id', 'name', 'value'
    ];
    public $timestamps = false; // Disable timestamps


    public function producst()
    {
        return $this->belongsTo(Product::class);
    }


    use HasFactory;
}
