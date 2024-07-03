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
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;
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

    public function redirectToGoogle()
    {
        $url = Socialite::driver('google')->stateless()->redirect()->getTargetUrl();
        return response()->json(['url' => $url]);
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            
            $authUser = $this->findOrCreateUser($googleUser);

           
            $token = $authUser->createToken('Personal Access Token')->plainTextToken;

            return response()->json(['token' => $token], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }



// public function findOrCreateUser($googleUser)
// {
//     $authUser = Customer::where('google_id', $googleUser->id or 'email',$googleUser->email )->first() ||
//         Vendor::where('google_id', $googleUser->id)->first() ||
//         Admin::where('google_id', $googleUser->id)->first();

//     if ($authUser) {
//         return $authUser;
//     }

//     return Customer::create([
//         'name' => $googleUser->name,
//         'email' => $googleUser->email,
//         'google_id' => $googleUser->id,
//         'image' => $googleUser->avatar,
//         'password' => bcrypt(Str::random(16)),
//     ]);
    public function findOrCreateUser($googleUser)
{
    $authUser = Customer::where('google_id', $googleUser->id)
                         ->orWhere('email', $googleUser->email)
                         ->first();

    if (!$authUser) {
        $authUser = Vendor::where('google_id', $googleUser->id)
                    ->orWhere('email', $googleUser->email)
                     ->first();
    }

    if (!$authUser) {
        $authUser = Admin::where('google_id', $googleUser->id)
        ->orWhere('email', $googleUser->email)
        ->first();
    }

    if ($authUser) {
        return $authUser;
    }

    return Customer::create([
        'name' => $googleUser->name,
        'email' => $googleUser->email,
        'google_id' => $googleUser->id,
        'image' => $googleUser->avatar,
        'password' => bcrypt(Str::random(16)),
    ]);
}
}
    
 
