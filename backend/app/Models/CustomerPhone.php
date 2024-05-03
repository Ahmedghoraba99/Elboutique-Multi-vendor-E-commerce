<?php

namespace App\Models;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerPhone extends Model
{
    use HasApiTokens,HasFactory;

    protected $fillable = [
        'phoneNumper',
        'customer_id',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    
}
