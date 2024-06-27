<?php

namespace App\Policies;

use App\Models\Customer;
use App\Models\Tag;
use Illuminate\Auth\Access\Response;

class TagPolicy
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
    public function view(Customer $customer, Tag $tag): bool
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
    public function update(Customer $customer, Tag $tag): bool
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(Customer $customer, Tag $tag): bool
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(Customer $customer, Tag $tag): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(Customer $customer, Tag $tag): bool
    {
        //
    }
}
