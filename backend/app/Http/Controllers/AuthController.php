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
    private static $frontendUrl;
    public function __construct()
    {
        self::$frontendUrl = config('app.frontend_url');
    }

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

    private function redirectToOAuth($driver)
{
    $url = Socialite::driver($driver)->stateless()->redirect()->getTargetUrl();
    return response()->json(['url' => $url]);
}

public function redirectToFacebook()
{
    return $this->redirectToOAuth('facebook');
}

public function redirectToGoogle()
{
    return $this->redirectToOAuth('google');
}
 


    private function handleOAuthCallback($driver)
{
    try {
        $user = Socialite::driver($driver)->stateless()->user();
        $authUser = $this->findOrCreateUser($user);
        $token = $authUser->createToken('Personal Access Token')->plainTextToken;
        $role = strtolower(class_basename($authUser));
        return redirect()->to(self::$frontendUrl."/login?token={$token}&role={$role}&id={$authUser->id}");
    } catch (\Exception $e) {
        $errorMessage = 'Unauthorized';
        if (config('app.debug')) {
            $errorMessage.= ': '. $e->getMessage();
        }
        return response()->json(['error' => $errorMessage], 401);
    }
    
}



private function findUserByEmail($email)
{
    $models = [Customer::class, Vendor::class, Admin::class];

    foreach ($models as $model) {
        $user = $model::where('email', $email)->first();
        if ($user) {
            return $user;
        }
    }

    return null;
}

 

private function findOrCreateUser($socialUser )
{
    $authUser = $this->findUserByEmail($socialUser->email);

    if ($authUser) {
        return $authUser;
    }

    return Customer::create([
        'name' => $socialUser->name,
        'email' => $socialUser->email,
        'image' => $socialUser->avatar,
        'password' => bcrypt(Str::random(16)),
    ]);
}
public function handleGoogleCallback()
{
    return $this->handleOAuthCallback('google');
}

public function handleFacebookCallback()
{
    return $this->handleOAuthCallback('facebook');
}
 
}
    
 
