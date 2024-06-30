<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class GetwayCheckoutController extends Controller
{
    
    public function index(){
      $order=  Order::create([
            'customer_id'=>1,
            "total" => 1000
        ]);
        $PaymentKey=PayMobController::pay($order->total,$order->id);
        // return view('paymob')->with('token',$PaymentKey);
        return response()->json(['token' => "$PaymentKey"], 200);
        // return response->json $PaymentKey;

    }
    
}
