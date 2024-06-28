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
        return  $user instanceof Admin|| $user->banned =='false';
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(   $user, Order $order): bool
    {
        return $user instanceof Admin||
        ( $user->id === $order->customer_id &&
         $order->status=='midway'&&
        $user->banned =='false');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete( $user, Order $order): bool
    {
        return ($user->id === $order->customer_id && $order->status=='midway')||
         $user instanceof Admin;
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

    public function attachProductToOrder(  $user, Order $order)
    {
         
        return $user->id === $order->customer_id|| $user instanceof Admin;
    }

    /**
     * Determine if the authenticated user can detach a product from a customer's wishlist.
     */
    public function detachProductToOrder(  $user, Order $order)
    {
         
        return $user->id === $order->customer_id|| $user instanceof Admin;
    }

    /**
     * Determine if the authenticated user can view a customer's wishlist.
     */
    public function getOrderProduct(  $user, Order $order)
    {
         
        return $user->id === $order->customer_id|| $user instanceof Admin;
    }
}
