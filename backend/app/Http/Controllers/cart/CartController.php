<?php

namespace App\Http\Controllers\cart;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function attachProductToCustomerCart(Request $request,$id){
        
        $products=[];
        foreach ($request->products as $product_id => $quantity) {
            $product=Product::find($product_id);
            if (!$product) {
                return response()->json(["message"=> "Product Doesn't exist"],404);
            }
            $products[$product_id] = ['quantity' => $quantity];
        }
        $customer = Customer::find($id);
        $customer->cartProducts()->syncWithoutDetaching($products);
        return response()->json(["message"=>"Products Attached to cart"],200);
    }

    public function detachProductFromCustomerCart(Request $request,$id){
        $product=Product::find($request->all()["products"]);
        if (!$product) {
            return response()->json(["message"=> "Product Doesn't exist"],404);
        }
        $customer = Customer::find($id);
        $customer->cartProducts()->detach($request->all("products"));
        return response()->json(["message"=>"Product Detatched from cart"],200);
    }

    public function showCutsomerCart($id){
        $customer = Customer::find($id);
        return $customer->cartProducts;
    }
}
