<?php


use App\Http\Controllers\AuthController;
use App\Http\Controllers\admin\AdminController;
use App\Http\Controllers\API\Payment\PaymentController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\cart\CartController;
use App\Http\Controllers\customer\CustomerController;
use App\Http\Controllers\customer\CustomerAddressController;
use App\Http\Controllers\customer\CustomerPhoneController;
use App\Http\Controllers\order\OrderController;
use App\Http\Controllers\category\CategoryController;
use App\Http\Controllers\PayPalController;
use App\Http\Controllers\tag\TagController;
use App\Http\Controllers\product\ProductController;

use App\Http\Controllers\order\OrderProductController;

use App\Http\Controllers\vendor\VendorController;
use App\Http\Controllers\VendorReceivablesController;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\wishlist\WishlistController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Payment\GetwayCheckoutController;



require_once __DIR__ . '/ReviewRoutes/reviewRoutes.php';
require_once __DIR__ . '/ReportRoutes/reportProductRoutes.php';
require_once __DIR__ . '/ReportRoutes/reportReviewRotes.php';

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});



// Endpoints that use admin gaurd

Route::group(['middleware' => ['auth:admin']], function () {

    // Update users status "active banned"  endpoints
    Route::get('/vendors/active/{vendor}', [VendorController::class, 'activateVendor']);
    Route::get('/vendors/ban/{vendor}', [VendorController::class, 'banVendor']);
    Route::get('/customers/active/{customer}', [CustomerController::class, 'activateCustomer']);
    Route::get('/customers/ban/{customer}', [CustomerController::class, 'banCustomer']);

    //Customer addresses & phones endpoints
    Route::apiResource('customeraddresses', CustomerAddressController::class);
    Route::apiResource('customerphones', CustomerPhoneController::class);


    Route::apiResource('admins', AdminController::class);
    Route::get('vendors', [VendorController::class, 'index'])->name('vendors.index');
    Route::get('customers', [CustomerController::class, 'index'])->name('customers.index');



    Route::apiResource('tags', TagController::class);
    Route::apiResource('categories', CategoryController::class);


    Route::get('/product/featured/{id}', [ProductController::class, "featureAndUnfeatureProduct"]);
    Route::apiResource('vendor-eceivables', VendorReceivablesController::class);
    Route::post('/changeorderstatus/{order}', [OrderController::class, "changeStatus"]);
});


// Endpoints that use vendor gaurd
Route::group(['middleware' => ['auth:sanctum', 'AdminVendorAuth']], function () {
    Route::apiResource('products', ProductController::class);
    Route::patch('vendors/{vendor}', [VendorController::class, 'update']);
    Route::put('vendors/{vendor}', [VendorController::class, 'update']);
    Route::delete('vendors/{vendor}', [VendorController::class, 'destroy']);

    Route::get('vendors/vendoreceivables/{vendor}', [VendorController::class, 'getVendorReceivables']);
});


// Endpoints that use customer guard
Route::group(['middleware' => ['auth:sanctum', 'AdminCustomerAuth']], function () {

    //cart endpoint
    Route::post('/customer/addCart/{id}', [CartController::class, 'attachProductToCustomerCart']);
    Route::post('/customer/deleteCart/{id}', [CartController::class, 'detachProductFromCustomerCart']);
    Route::get('/customer/showCart/{id}', [CartController::class, 'showCutsomerCart']);
    Route::delete('/customer/clearCart/{id}', [CartController::class, 'clearCart']);

    //wishlist endpoint
    Route::post('/customer/addWishlist/{id}', [WishlistController::class, 'attachProductToCustomerWishlist']);
    Route::post('/customer/deleteWishlist/{id}', [WishlistController::class, 'detachProductFromCustomerWishlist']);
    Route::get('/customer/showWishlist/{id}', [WishlistController::class, 'showCutsomerWishlist']);

    // Order related routes
    Route::apiResource('orders', OrderController::class);
    Route::get('/orders/users/{id}', [OrderController::class, 'getUserOrders']);
    Route::post('/orders/addProducts/{id}', [OrderProductController::class, 'addProductToOrder']);
    Route::post('/orders/deleteProducts/{id}', [OrderProductController::class, 'deleteProductFromOrder']);
    Route::get('/orders/showProducts/{id}', [OrderProductController::class, 'getOrderProduct']);

    Route::patch('customers/{customer}', [CustomerController::class, 'update']);
    Route::put('customers/{customer}', [CustomerController::class, 'update']);
    Route::delete('customers/{customer}', [CustomerController::class, 'destroy']);
});




//Email verification endpoints
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('/email/send', [VerificationController::class, 'sendVerificationEmail']);
    Route::get('/email/verify/{id}/{hash}', [VerificationController::class, 'verify'])->name('verification.verify');
    Route::post('/email/resend', [VerificationController::class, 'resend'])->name('verification.resend');
});







// Endpoints that don't require authentication.





// General application data endpoints

Route::get('admins/{admin}', [AdminController::class, 'show']);
Route::get('vendors/{vendor}', [VendorController::class, 'show']);
Route::get('customers/{customer}', [CustomerController::class, 'show']);


Route::get('products/{product}', [ProductController::class, 'show'])->name('products.show');
Route::get('products', [ProductController::class, 'index'])->name('products.index');
Route::post('products/tages',[ProductController::class, 'storeProductTags']);
Route::get('products/tages/{id}', [ProductController::class, 'getTagsByProductId']);

Route::get('categories/{category}', [CategoryController::class, 'show'])->name('categories.show');
Route::get('categories', [CategoryController::class, 'index'])->name('categories.index');


Route::get('tags/{tag}', [TagController::class, 'show'])->name('tags.show');
Route::get('tags', [TagController::class, 'index'])->name('tags.index');
Route::get('tages/product/{id}',[TagController::class , 'getAllTags']);

// Product related
Route::get('/product/featured', [ProductController::class, "getFeaturedProducts"]);
Route::get('/product/category/{id}', [ProductController::class, "getProductsByCategory"]);

Route::get('/product/onsale', [ProductController::class, "getProductsOnSale"]);
Route::get('/product/newarrivals', [ProductController::class, "getNewArrivalProducts"]);
Route::get('/product/search', [ProductController::class, "searchProduct"]);
Route::get('/product/vendor/{id}', [ProductController::class, "getVendorProducts"])->where('id', '[0-9]+');



//Login & logout register endpoints
Route::post('/login',  [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/registerFormValdation', [AuthController::class, 'registerFormValdation']);
Route::post('vendors', [VendorController::class, 'store']);
Route::post('customers', [CustomerController::class, 'store']);


//Forgot-password endpoints
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail']);
Route::post('/password/reset', [PasswordResetController::class, 'reset'])->name('password.reset');


Route::post('payment', [PayPalController::class, 'createPayment'])->name('payment');
Route::get('payment/success', [PayPalController::class, 'success'])->name('payment.success');
Route::get('payment/cancel', [PayPalController::class, 'cancel'])->name('payment.cancel');



Route::post('/getway-checkout/processed',[PaymentController::class, 'checkout_processed']);
Route::get('/checkout/response', function (Request $request) {
    redirect(config('frontend_url') . '/checkout'.'?success=true');
    return $request->all() ;
});
Route::post('getway-checkout',  [GetwayCheckoutController::class,'index']);
