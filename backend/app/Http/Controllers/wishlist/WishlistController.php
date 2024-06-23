<?php

namespace App\Http\Controllers\wishlist;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function attachProductToCustomerWishlist(Request $request,$id){
        $customer = Customer::find($id);
        if (!$customer) {
            return response()->json(["message"=> "Customer Doesn't exist"],404);
        }
        $customer->wishlistProducts()->syncWithoutDetaching($request->products);
        return response()->json(["message"=>"Products Attached to wishlist"],200);
    }

    public function detachProductFromCustomerWishlist(Request $request,$id){
        $customer = Customer::find($id);
        $product=Product::find($request->all()["products"]);
        $flag = false;
        foreach ($customer->wishlistProducts as $key => $wishlistProduct) {
            if($product->id === $wishlistProduct->id){
                $flag = true;
            }
        }
        if(!$flag){
            return response()->json(["message"=> "Product Doesn't exist in wishlist"],404);
        }
        $customer->wishlistProducts()->detach($request->all("products"));
        return response()->json(["message"=>"Product Detatched from wishlist"],200);
    }

    public function showCutsomerWishlist($id){
        $customer = Customer::find($id);
        if (!$customer) {
            return response()->json(["message"=> "Customer Doesn't exist"],404);
        }
        $wishlistProducts = $customer->wishlistProducts()->with(['images','tags','vendor'])->get();
        return response()->json($wishlistProducts,200);
    }
}
