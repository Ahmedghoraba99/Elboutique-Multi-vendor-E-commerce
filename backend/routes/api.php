<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductImagesController;
use App\Http\Controllers\OrderProductController;
use App\Http\Controllers\VendorController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

require_once __DIR__ .'/ReviewRoutes/reviewRoutes.php';
require_once __DIR__ . '/ReportRoutes/reportProductRoutes.php';
require_once __DIR__ . '/ReportRoutes/reportReviewRotes.php';

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group([], function () {
    Route::apiResource('admins', AdminController::class);
    Route::apiResource('vendors', VendorController::class);
    Route::apiResource('customers', CustomerController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('tags', TagController::class);
    Route::apiResource('products', ProductController::class);
});
// Order related routes
Route::post('/orders/{id}/products', [OrderProductController::class, 'addProductToOrder']);
Route::apiResource('orders', OrderController::class);

Route::post('/orders/{id}/products', [OrderProductController::class, 'addProductToOrder']);
Route::get('/orders/{id}/products', [OrderProductController::class, 'getOrderProduct']);
