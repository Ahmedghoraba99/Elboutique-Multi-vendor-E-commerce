<?php

namespace App\Models;

use App\Notifications\ResetPasswordNotification;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Vendor extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $appends = ['image_url','national_id_url'];
     

    public function getImageUrlAttribute()
    {
        return url('storage/images/vendors/' . $this->image);
    }
    public function getNationalIdUrlAttribute()
    {
        return url('storage/images/vendors/national_id/' . $this->national_id);
    }
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token));
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
        'address',
        'phone',
        'national_id',
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

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    function products(){
        return $this->hasMany(Product::class);
    }

    public function vendorReceivables()
    {
        return $this->hasOne(VendorReceivables::class);
    }

}
