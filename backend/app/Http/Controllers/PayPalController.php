<?php
 

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PayPalService;

class PayPalController extends Controller
{
    protected $payPalService;

    public function __construct(PayPalService $payPalService)
    {
        $this->payPalService = $payPalService;
    }

    public function createPayment(Request $request)
    {$invoiceId = 1;
        $data = [
            'items' => [],
            'invoice_id' => $invoiceId,
            'invoice_description' => "Order #$invoiceId Invoice",
            'return_url' => route('payment.success'),
            'cancel_url' => route('payment.cancel'),
            'total' => 50000
        ];

        $response = $this->payPalService->createPayment($data);

        if (isset($response['paypal_link'])) {
            return response()->json(['paypal_link' => $response['paypal_link']]);
        }

        return response()->json(['error' => 'Unable to create PayPal payment'], 500);
    }

    public function cancel()
    {
        return response()->json(['message' => 'Payment Cancelled'], 482);
    }

    public function success(Request $request)
    {
        $response = $this->payPalService->getPaymentDetails($request->token);
        $frontEndUrl = env('FRONTEND_URL', 'http://localhost:4200') . '/checkout';

        if (in_array(strtoupper($response['ACK']), ['SUCCESS', 'SUCCESSWITHWARNING'])) {
            return redirect($frontEndUrl . '?success=true');
        }

        return redirect($frontEndUrl . '?success=false');
    }
}

