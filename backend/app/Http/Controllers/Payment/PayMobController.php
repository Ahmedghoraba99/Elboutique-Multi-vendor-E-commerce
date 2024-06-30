<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use PayMob\Facades\PayMob;

class PayMobController extends Controller
{
    public static function pay(float $total ,int $order_Id){
         
        $auth = PayMob::AuthenticationRequest();
         
        $order = PayMob::OrderRegistrationAPI([
            'auth_token' => $auth->token,
            'amount_cents' => $total * 100,  
            'currency' => 'EGP',
            'delivery_needed' => false,  
            'merchant_order_id' => $order_Id,  
            'items' => []  
        ]);
        $PaymentKey = PayMob::PaymentKeyRequest([
            'auth_token' => $auth->token,
            'amount_cents' => $total * 100,  
            'currency' => 'EGP',
            'order_id' => $order->id,
            "billing_data" => [  
                "apartment" => "803",
                "email" => "claudette09@exa.com",
                "floor" => "42",
                "first_name" => "Clifford",
                "street" => "Ethan Land",
                "building" => "8028",
                "phone_number" => "+86(8)9135210487",
                "shipping_method" => "PKG",
                "postal_code" => "01898",
                "city" => "Jaskolskiburgh",
                "country" => "CR",
                "last_name" => "Nicolas",
                "state" => "Utah"
            ]
        ]);

        return $PaymentKey->token;
    }
    public static function checkout_processed(Request $request){
        $request_hmac = $request->hmac;
        $calc_hmac = PayMob::calcHMAC($request);
    
        if ($request_hmac == $calc_hmac) {
            $order_id = $request->obj['order']['merchant_order_id'];
            $amount_cents = $request->obj['amount_cents'];
            $transaction_id = $request->obj['id'];
    
            $order = Order::find($order_id);
    
            if ($request->obj['success'] == true && ($order->total * 100) == $amount_cents) {
                $order->update([
                    'payment_status' => 'finished',
                    'transaction_id' => $transaction_id
                ]);
            } else {
                $order->update([
                    'payment_status' => "failed",
                    'transaction_id' => $transaction_id
                ]);
            }
        }

    }
}
