<?php

namespace App\Policies;

use App\Models\Admin;
use App\Models\Customer;
use Illuminate\Auth\Access\Response;

class AdminPolicy
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
    public function view(Customer $customer, Admin $admin): bool
    {
        //
    }

    /**
     * Determine whether the user can create models.
     */
    public function create( $customer): bool
    {
        return  $customer instanceof Admin;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(  $customer, Admin $admin): bool
    {
        return  $customer instanceof Admin;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(Customer $customer, Admin $admin): bool
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(Customer $customer, Admin $admin): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(Customer $customer, Admin $admin): bool
    {
        //
    }
}
