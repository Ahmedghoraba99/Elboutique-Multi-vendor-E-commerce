<?php

 
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
class CustomerAddress extends Model
{
    use HasApiTokens,HasFactory;

    protected $fillable = [
        'governorate',
        'city',
        'street',
        'house_number',
        'customer_id',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
     
}