<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\cart\CartController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\order\OrderController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductImagesController;
use App\Http\Controllers\order\OrderProductController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\wishlist\WishlistControlle;
use App\Http\Controllers\wishlist\WishlistController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

require_once __DIR__ .'/ReviewRoutes/reviewRoutes.php';
require_once __DIR__ . '/ReportRoutes/reportProductRoutes.php';

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
Route::apiResource('orders', OrderController::class);

Route::post('/orders/{id}/addProducts', [OrderProductController::class, 'addProductToOrder']);
Route::post('/orders/{id}/deleteProducts', [OrderProductController::class, 'deleteProductFromOrder']);
Route::get('/orders/{id}/showProducts', [OrderProductController::class, 'getOrderProduct']);

//cart endpoint
Route::post('/customer/{id}/addCart',[CartController::class,'attachProductToCustomerCart']);
Route::post('/customer/{id}/deleteCart',[CartController::class,'detachProductFromCustomerCart']);
Route::get('/customer/{id}/showCart',[CartController::class,'showCutsomerCart']);

//wishlist endpoint
Route::post('/customer/{id}/addWishlist',[WishlistController::class,'attachProductToCustomerWishlist']);
Route::post('/customer/{id}/deleteWishlist',[WishlistController::class,'detachProductFromCustomerWishlist']);
Route::get('/customer/{id}/showWishlist',[WishlistController::class,'showCutsomerWishlist']);