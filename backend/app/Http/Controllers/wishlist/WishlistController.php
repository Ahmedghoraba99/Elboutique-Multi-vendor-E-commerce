<?php

namespace App\Http\Controllers\wishlist;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function attachProductToCustomerWishlist(Request $request,$id){
        // dd($request->products);
        $customer = Customer::find($id);
        if (!$customer) {
            return response()->json(["message"=> "Customer Doesn't exist"],404);
        }
        $customer->wishlistProducts()->syncWithoutDetaching($request->products);
        return response()->json(["message"=>"Products Attached to wishlist"],200);
    }

    public function detachProductFromCustomerWishlist(Request $request,$id){
        $product=Product::find($request->all()["products"]);
        if (!$product) {
            return response()->json(["message"=> "Product Doesn't exist"],404);
        }
        $customer = Customer::find($id);
        $customer->wishlistProducts()->detach($request->all("products"));
        return response()->json(["message"=>"Product Detatched from wishlist"],200);
    }

    public function showCutsomerWishlist($id){
        $customer = Customer::find($id);
        if (!$customer) {
            return response()->json(["message"=> "Customer Doesn't exist"],404);
        }
        return $customer->wishlistProducts;
    }
}
