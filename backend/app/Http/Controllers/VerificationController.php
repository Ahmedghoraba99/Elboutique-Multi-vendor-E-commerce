<?php

namespace App\Http\Controllers;


use Illuminate\Support\Facades\Log;

use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;

class VerificationController extends Controller
{
    public function verify(EmailVerificationRequest $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.'], 400);
        }
        $request->fulfill();
        return response()->json(['message' => 'Email verified successfully.']);
    }

    public function resend(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.'], 400);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json(['message' => 'Verification link sent!']);
    }


    public function sendVerificationEmail(Request $request)
    {
        $user = $request->user();
        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.'], 400);
        }

        try {
        $user->sendEmailVerificationNotification() ;
        } catch (\Exception $e) {
            Log::error('Error sending email verification:', ['exception' => $e]);
            return response()->json(['message' => 'Failed to send verification link.'], 500);
        }

        return response()->json(['message' => 'Verification link sent!']);
    }
}





