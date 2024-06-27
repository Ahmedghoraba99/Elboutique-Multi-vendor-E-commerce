<?php

namespace App\Policies;

use App\Models\Admin;
use App\Models\Customer;
use App\Models\Vendor;
use Illuminate\Auth\Access\Response;

class VendorPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(Customer $customer): bool
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(Customer $customer, Vendor $vendor): bool
    {
        //
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(Customer $customer): bool
    {
        //
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update($user, Vendor $vendor): bool
    {
        return  $user instanceof Admin||$user->id == $vendor->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete($user, Vendor $vendor): bool
    {
        return  $user instanceof Admin||$user->id == $vendor->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(Customer $customer, Vendor $vendor): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(Customer $customer, Vendor $vendor): bool
    {
        //
    }
}
