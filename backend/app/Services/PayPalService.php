<?php
 

namespace App\Services;

use Srmklive\PayPal\Services\ExpressCheckout;
use Illuminate\Support\Facades\Log;

class PayPalService
{
    protected $provider;

    public function __construct()
    {
        $this->provider = new ExpressCheckout;
    }

    public function createPayment(array $data)
    {
        try {
            $response = $this->provider->setExpressCheckout($data, true);
            Log::info('PayPal createPayment response: ', $response);
            return $response;
        } catch (\Exception $e) {
            Log::error('PayPal createPayment error: ' . $e->getMessage());
            return ['error' => $e->getMessage()];
        }
    }

    public function getPaymentDetails($token)
    {
        try {
            $response = $this->provider->getExpressCheckoutDetails($token);
            Log::info('PayPal getPaymentDetails response: ', $response);
            return $response;
        } catch (\Exception $e) {
            Log::error('PayPal getPaymentDetails error: ' . $e->getMessage());
            return ['error' => $e->getMessage()];
        }
    }
}



