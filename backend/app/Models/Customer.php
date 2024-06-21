<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
 
use Illuminate\Foundation\Auth\User as Authenticatable;

class Customer extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        return url('storage/images/customers/' . $this->image);
    }
       /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'image',
        // 'address',
        // 'phone',
        'banned',
        'active'
    ];
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    function addresses(){
        return $this->hasMany(CustomerAddress::class);
    }
    function phones(){
        return $this->hasMany(CustomerPhone::class);
    }

    public function orders(){
        return $this->hasMany(Order::class);
    }
    public function cartProducts(){
        return $this->belongsToMany(Product::class,'carts')->withPivot('quantity')->as('cart_table');
    }
    public function wishlistProducts(){
        return $this->belongsToMany(Product::class,'wishlists');
    }

    public function reviews(){
        return $this->hasMany(Review::class);
    }

    public function reportProducts(){
        return $this->hasMany(ReportProduct::class);
    }

    public function reportReviews(){
        return $this->hasMany(ReportReview::class);
    }



}
