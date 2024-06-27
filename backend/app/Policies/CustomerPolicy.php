<?php

namespace App\Policies;

use App\Models\Admin;
use App\Models\Customer;
use Illuminate\Auth\Access\Response;

class CustomerPolicy
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
    public function view($user, Customer $customer): bool
    {
        //
    }

    /**
     * Determine whether the user can create models.
     */
    public function create($user): bool
    {
        //
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update( $user, Customer $customer): bool
    {
        return  $user instanceof Admin||$user->id == $customer->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete($user, Customer $customer): bool
    {
        return  $user instanceof Admin||$user->id == $customer->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore($user, Customer $customer): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete($user, Customer $customer): bool
    {
        //
    }


    public function attachWishlist(  $user, Customer $customer)
    {
        // Example logic: user can attach if they own the customer account or are an admin
        return $user->id === $customer->id || $user instanceof Admin;
    }

    /**
     * Determine if the authenticated user can detach a product from a customer's wishlist.
     */
    public function detachWishlist(  $user, Customer $customer)
    {
        // Example logic: user can detach if they own the customer account or are an admin
        return $user->id === $customer->id || $user instanceof Admin;
    }

    /**
     * Determine if the authenticated user can view a customer's wishlist.
     */
    public function viewWishlist(  $user, Customer $customer)
    {
        // Example logic: user can view if they own the customer account or are an admin
        return $user->id === $customer->id || $user instanceof Admin;
    }
}
