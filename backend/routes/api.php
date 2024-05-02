<?php
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderProductController;
use App\Http\Controllers\VendorController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::group([],function(){
Route::apiResource('admins',AdminController::class);
Route::apiResource('vendors',VendorController::class);
Route::apiResource('customers',CustomerController::class);
});


Route::apiResource('orders', OrderController::class);

Route::post('/orders/{id}/products',[OrderProductController::class,'addProductToOrder']);
Route::get('/orders/{id}/products',[OrderProductController::class,'getOrderProduct']);
