<?php

 

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
 
use App\Models\Vendor;
use App\Models\Customer;
use App\Models\Admin;

class PasswordResetController extends Controller
{
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $email = $request->email;
        $user = $this->findUserByEmail($email);

        if (!$user) {
            return response()->json(['message' => 'No user found with this email address.'], 404);
        }

        $status = Password::broker($user['type'])->sendResetLink(
            ['email' => $email]
        );

        if ($status == Password::RESET_LINK_SENT) {
            return response()->json(['message' => __($status)], 200);
        } else {
            return response()->json(['message' => __($status)], 400);
        }
    }

    public function reset(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|string|min:8|regex:/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/',
        ]);

        $email = $request->email;
        $user = $this->findUserByEmail($email);

        if (!$user) {
            return response()->json(['message' => 'No user found with this email address.'], 404);
        }

        $status = Password::broker($user['type'])->reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($userInstance, $password) {
                $userInstance->forceFill([
                    'password' => Hash::make($password),
                ])->setRememberToken(Str::random(60));

                $userInstance->save();
            }
        );

        if ($status == Password::PASSWORD_RESET) {
            return response()->json(['message' => __($status)], 200);
        } else {
            return response()->json(['message' => __($status)], 400);
        }
    }

    private function findUserByEmail($email)
    {
        if ($user = Vendor::where('email', $email)->first()) {
            return ['type' => 'vendors', 'user' => $user];
        }

        if ($user = Customer::where('email', $email)->first()) {
            return ['type' => 'customers', 'user' => $user];
        }

        if ($user = Admin::where('email', $email)->first()) {
            return ['type' => 'admins', 'user' => $user];
        }

        return null;
    }
}

