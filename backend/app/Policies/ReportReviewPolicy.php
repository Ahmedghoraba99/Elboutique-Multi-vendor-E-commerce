<?php

namespace App\Policies;

use App\Models\Admin;
use App\Models\Customer;
use App\Models\ReportReview;
use Illuminate\Auth\Access\Response;

class ReportReviewPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(Customer $customer)
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(Customer $customer, ReportReview $reportReview)
    {
        //
    }

    /**
     * Determine whether the user can create models.
     */
<<<<<<< HEAD
    public function create(  $user)
=======
    public function create( $user): bool
>>>>>>> 685643cde70532398185801ac27530d13d81d4a2
    {
       
         
 return $user instanceof Admin || (!$user->banned && !$user->reviews->where('customer_id', $user->id)->exists());
      
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update($user, ReportReview $reportReview)
    {
        return $user->id === $reportReview->customer_id|| $user  instanceof Admin;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete($user, ReportReview $reportReview)
    {
        return $user->id === $reportReview->customer_id|| $user  instanceof Admin;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(Customer $customer, ReportReview $reportReview)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(Customer $customer, ReportReview $reportReview)
    {
        //
    }
}
