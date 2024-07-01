<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Http\Requests\PaymentRequest;
 

class GetwayCheckoutController extends Controller
{
    
    public function index(PaymentRequest $request){

      
        $PaymentKey=PayMobController::pay($request->total,$request->order_id);
      
        return response()->json(['token' => "$PaymentKey"], 200);
        

    }
    
}
