<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class GetwayCheckoutController extends Controller
{
    
    public function index(Request $request){

      $order=  Order::create([
            'customer_id'=>1,
            "total" => 1000
        ]);
        
        $PaymentKey=PayMobController::pay($request->order_total,$request->order_id);
      
        return response()->json(['token' => "$PaymentKey"], 200);
        

    }
    
}
