<?php

namespace App\Http\Controllers;


use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterFormValdationRequest;
use App\Models\Admin;
use App\Models\Customer;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(LoginRequest $request) {

        $user = $this->getUserByRole($request->role, $request->email);

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }
        else if( !($user instanceof Admin) and !$user->hasVerifiedEmail()   ){
            return response()->json(['error' => 'Email not verified.'], 400);
        }
        if ($user->tokens()->count() >= 5) {
            $user->tokens()->first()->delete();
        }

        return response()->json([
            'token' => $user->createToken($user->name||$user->lname)->plainTextToken,
            'id' => $user->id,
            'role' => $request->role,
        ]);
    }


    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Successfully logged out']);
    }

    public function registerFormValdation(RegisterFormValdationRequest $request) {
        
    }


    private function getUserByRole($role, $email) {
        switch ($role) {
            case 'customer':
                return Customer::where('email', $email)->first();
            case 'vendor':
                return Vendor::where('email', $email)->first();
            case 'admin':
                return Admin::where('email', $email)->first();
            default:
                return null;
        }
    }
    
}
