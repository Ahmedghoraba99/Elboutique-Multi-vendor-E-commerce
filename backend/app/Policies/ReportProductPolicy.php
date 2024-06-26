<?php

namespace App\Policies;

use App\Models\Admin;
use App\Models\Customer;
use App\Models\ReportProduct;
 

class ReportProductPolicy
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
    public function view(Customer $customer, ReportProduct $reportProduct): bool
    {
        //
    }

    /**
     * Determine whether the user can create models.
     */
    public function create($user,$product_id ): bool
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
    public function update($user, ReportProduct $reportProduct): bool
    {
        if($user instanceof Admin){
            return true;
        }
        if($user->banned =='true') {
            return false;
        }
        return $user->id === $reportProduct->customer_id ;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete($user, ReportProduct $reportProduct): bool
    {
        return $user->id === $reportProduct->customer_id|| $user  instanceof Admin;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(Customer $customer, ReportProduct $reportProduct): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(Customer $customer, ReportProduct $reportProduct): bool
    {
        //
    }
}
