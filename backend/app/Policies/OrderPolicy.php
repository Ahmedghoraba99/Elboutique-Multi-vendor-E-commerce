<?php

namespace App\Policies;

use App\Models\Admin;
use App\Models\Customer;
use App\Models\Order;
use Illuminate\Auth\Access\Response;

class OrderPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(  $user): bool
    {
      return  $user instanceof Admin;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(    $user, Order $order): bool
    {
        return $user->id === $order->customer_id|| $user instanceof Admin;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(   $user): bool
    {
        //
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(   $user, Order $order): bool
    {
        return $user->id === $order->customer_id|| $user instanceof Admin;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete( $user, Order $order): bool
    {
        return $user->id === $order->customer_id|| $user instanceof Admin;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(Customer $customer, Order $order): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(Customer $customer, Order $order): bool
    {
        //
    }
}
