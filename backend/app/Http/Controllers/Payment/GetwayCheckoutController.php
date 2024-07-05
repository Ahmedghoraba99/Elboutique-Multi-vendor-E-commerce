<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Http\Requests\PaymentRequest;
use App\Models\Order;

class GetwayCheckoutController extends Controller
{
    
    public function index(PaymentRequest $request){

     $order= Order::create([
        'customer_id' => 1,
        'total' => $request->total,
         
      ]);
    //   return $order->id;
        $PaymentKey=PayMobController::pay($request->total,$order->id);//$request->order_id);
      
        return response()->json(['token' => "$PaymentKey"], 200);
        

    }
    
}
