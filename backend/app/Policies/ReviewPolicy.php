<?php

namespace App\Policies;

use App\Models\Admin;
use App\Models\Customer;
use App\Models\Review;
use Illuminate\Auth\Access\Response;

class ReviewPolicy
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
    public function view($user, Review $review): bool
    {
        //
    }

    /**
     * Determine whether the user can create models.
     */
    public function create($user,$product_id): bool
    {
        if($user instanceof Admin){
            return true;
        }
        if($user->banned =='true') {
            return false;
        }

        $orderProduct = $user->orders()->whereHas('products', function($query) use ($product_id) {
            $query->where('product_id', $product_id);
        })->first();

        return $orderProduct !== null;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update($user, Review $review): bool
    {
        if($user instanceof Admin){
            return true;
        }
        if($user->banned =='true') {
            return false;
        }
        return $user->id === $review->customer_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete($user, Review $review): bool
    {
        return $user->id === $review->customer_id|| $user  instanceof Admin;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(Customer $customer, Review $review): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(Customer $customer, Review $review): bool
    {
        //
    }
}
