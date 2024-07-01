<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

protected $fillable = ['customer_id','status',"total", 'payment_status',
'transaction_id',] ;
    function customer(){
        return $this->belongsTo(Customer::class);
    }
    public function products()
    {
        return $this->belongsToMany(Product::class)->withPivot('quantity');
    }
}

