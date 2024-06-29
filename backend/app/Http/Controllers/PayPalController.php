<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
 
 
use Srmklive\PayPal\Services\ExpressCheckout;

class PayPalController extends Controller
{
    protected $payPalService;

    public function __construct( )
    {
      
    }

    
    public function createPayment(Request $request)
    {
        $data = [];
        $data['items'] = [];
        $data['invoice_id'] = 1;
        $data['invoice_description'] = "Order #{$data['invoice_id']} Invoice";
        $data['return_url']= 'http://127.0.0.1:8000/api/payment/success';
        $data['cancel_url'] = 'http://127.0.0.1:8000/api/payment/cancel';
        $data['total'] = 50000;
            $provider = new ExpressCheckout;
            $response = $provider->setExpressCheckout ($data, true);
            return response()->json(['paypal_link' => $response['paypal_link']]);
    }

     

    public function cancel(){
        return response()->json( data: 'Payment Cancelled', status: 482);
    }


public function success (Request $request){
    $provider = new ExpressCheckout;
    $frontEndUrl=env('FRONTEND_URL','http://localhost:4200').'/checkout';
    $response = $provider->getExpressCheckoutDetails ($request->token);
    if (in_array(strtoupper($response['ACK']), ['SUCCESS', 'SUCCESSWITHWARNING'])) { 
        return redirect( $frontEndUrl.'?success=true');
        // return response()->json( data: 'Paid success');
    }
}
}
