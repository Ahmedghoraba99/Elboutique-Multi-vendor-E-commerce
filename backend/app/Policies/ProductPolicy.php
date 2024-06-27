<?php

namespace App\Policies;

use App\Models\Admin;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Auth\Access\Response;

class ProductPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny($user): bool
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view($user, Product $product): bool
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
    public function update(  $user, Product $product): bool
    {
        return $user->id === $product->vendor_id|| $user  instanceof Admin;

    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete($user, Product $product): bool
    {
        return $user->id === $product->vendor_id|| $user  instanceof Admin;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore($user, Product $product): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(Customer $customer, Product $product): bool
    {
        //
    }
}
