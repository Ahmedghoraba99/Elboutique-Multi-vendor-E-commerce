<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductImagesController;
use App\Http\Controllers\OrderProductController;
use App\Http\Controllers\VendorController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// API routes
Route::group([], function () {
    Route::apiResource('admins', AdminController::class);
    Route::apiResource('vendors', VendorController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('tags', TagController::class);
    Route::apiResource('products', ProductController::class);
});
// Order related routes
Route::post('/orders/{id}/products', [OrderProductController::class, 'addProductToOrder']);
Route::apiResource('orders', OrderController::class);
Route::post('/orders/{id}/products', [OrderProductController::class, 'addProductToOrder']);
Route::get('/orders/{id}/products', [OrderProductController::class, 'getOrderProduct']);
