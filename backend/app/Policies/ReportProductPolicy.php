<?php

namespace App\Policies;

use App\Models\Customer;
use App\Models\ReportProduct;
use Illuminate\Auth\Access\Response;

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
    public function create(Customer $customer): bool
    {
        //
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(Customer $customer, ReportProduct $reportProduct): bool
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(Customer $customer, ReportProduct $reportProduct): bool
    {
        //
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
