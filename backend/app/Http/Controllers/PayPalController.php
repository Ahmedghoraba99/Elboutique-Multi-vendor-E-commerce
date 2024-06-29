<?php
 

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PayPalService;

class PayPalController extends Controller
{
    private $payPalService;

    public function __construct(PayPalService $payPalService)
    {
        $this->payPalService = $payPalService;
    }

    public function createPayment(Request $request)
    {
        $invoiceId = 1;
        $data = $this->getPaymentData($request);

        $response = $this->payPalService->createPayment($data);

        if (isset($response['paypal_link'])) {
            return $this->getResponseWithLink($response['paypal_link']);
        }

        return $this->getErrorResponse();
    }

    public function cancel()
    {
        return response()->json(['message' => 'Payment Cancelled'], 482);
    }

    public function success(Request $request)
    {
        $response = $this->payPalService->getPaymentDetails($request->token);
        $frontEndUrl = $this->getFrontendUrl();

        if ($this->isPaymentSuccessful($response)) {
            return redirect($frontEndUrl . '?success=true');
        }

        return redirect($frontEndUrl . '?success=false');
    }

    private function getPaymentData($request)
    {
        return [
            'items' => [],
            'invoice_id' => $request->order_id,
            'invoice_description' => "Order #$request->order_id Invoice",
            'return_url' => route('payment.success'),
            'cancel_url' => route('payment.cancel'),
            'total' => $request->total
        ];
    }

    private function getResponseWithLink($link)
    {
        return response()->json(['paypal_link' => $link]);
    }

    private function getErrorResponse()
    {
        return response()->json(['error' => 'Unable to create PayPal payment'], 500);
    }

    private function getFrontendUrl()
    {
        return env('FRONTEND_URL', 'http://localhost:4200') . '/checkout';
    }

    private function isPaymentSuccessful($response)
    {
        return in_array(strtoupper($response['ACK']), ['SUCCESS', 'SUCCESSWITHWARNING']);
    }
}

