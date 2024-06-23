<?php

 
use App\Http\Controllers\AuthController;
use App\Http\Controllers\admin\AdminController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\cart\CartController;
use App\Http\Controllers\customer\CustomerController;
use App\Http\Controllers\customer\CustomerAddressController;
use App\Http\Controllers\customer\CustomerPhoneController;
use App\Http\Controllers\order\OrderController;
use App\Http\Controllers\category\CategoryController;
use App\Http\Controllers\tag\TagController;
use App\Http\Controllers\product\ProductController;
use App\Http\Controllers\product\ProductImagesController;
use App\Http\Controllers\order\OrderProductController;
use App\Http\Controllers\vendor\VendorController;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\wishlist\WishlistController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

 


require_once __DIR__ . '/ReviewRoutes/reviewRoutes.php';
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
    Route::apiResource('customeraddresses', CustomerAddressController::class);
    Route::apiResource('customerphones', CustomerPhoneController::class);
});
// Product related
Route::get('/product/featured', [ProductController::class, "getFeaturedProducts"]);
Route::get('/product/category/{id}', [ProductController::class, "getProductsByCategory"]);
Route::get('/product/featured/{id}', [ProductController::class, "featureAndUnfeatureProduct"]);
Route::get('/product/onsale', [ProductController::class, "getProductsOnSale"]);
Route::get('/product/newarrivals', [ProductController::class, "getNewArrivalProducts"]);



// Order related routes
Route::apiResource('orders', OrderController::class);

Route::post('/orders/addProducts/{id}', [OrderProductController::class, 'addProductToOrder']);
Route::post('/orders/deleteProducts/{id}', [OrderProductController::class, 'deleteProductFromOrder']);
Route::get('/orders/showProducts/{id}', [OrderProductController::class, 'getOrderProduct']);

//cart endpoint
Route::post('/customer/addCart/{id}', [CartController::class, 'attachProductToCustomerCart']);
Route::post('/customer/deleteCart/{id}', [CartController::class, 'detachProductFromCustomerCart']);
Route::get('/customer/showCart/{id}', [CartController::class, 'showCutsomerCart']);

//wishlist endpoint
Route::post('/customer/addWishlist/{id}', [WishlistController::class, 'attachProductToCustomerWishlist']);
Route::post('/customer/deleteWishlist/{id}', [WishlistController::class, 'detachProductFromCustomerWishlist']);
Route::get('/customer/showWishlist/{id}', [WishlistController::class, 'showCutsomerWishlist']);


Route::post('/login',  [AuthController::class, 'login']);

// Route::get('/verified-middleware-example', function () {
//     return response()->json([
//         'message' => 'The email account is already confirmed. Now you are able to see this message...',
//     ]);
// })->middleware( 'verified');

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('/email/send', [VerificationController::class, 'sendVerificationEmail']);
    Route::get('/email/verify/{id}/{hash}', [VerificationController::class, 'verify'])->name('verification.verify');
    Route::post('/email/resend', [VerificationController::class, 'resend'])->name('verification.resend');
});
 

Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail']);
Route::post('/password/reset', [PasswordResetController::class, 'reset']);