<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'review_id',
        'reason'
    ];

    public function review()
    {
        return $this->belongsTo(Review::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

}
