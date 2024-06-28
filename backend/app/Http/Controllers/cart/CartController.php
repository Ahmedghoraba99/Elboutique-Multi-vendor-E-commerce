<?php

namespace App\Http\Controllers\cart;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function attachProductToCustomerCart(Request $request,$id){
        $customer = Customer::find($id);
        if (!$customer) {
            return response()->json(["message"=> "Customer Doesn't exist"],404);
        }
        $this->authorize('detachCart', $customer);
        
        $products=[];
        foreach ($request->products as $product_id => $quantity) {
            $product=Product::find($product_id);
            if (!$product) {
                return response()->json(["message"=> "Product Doesn't exist"],404);
            }
            
            $products[$product_id] = ['quantity' => $quantity];
        }
       

        $customer->cartProducts()->syncWithoutDetaching($products);
        return response()->json(["message"=>"Products Attached to cart"],200);
    }

    public function detachProductFromCustomerCart(Request $request,$id){
        $customer = Customer::find($id);
        if (!$customer) {
            return response()->json(["message"=> "Customer Doesn't exist"],404);
        }
        $this->authorize('detachCart', $customer);
        $product=Product::find($request->all()["products"]);
        $flag = false;
        foreach ($customer->cartProducts as $key => $cartProduct) {
            if($product->id === $cartProduct->id){
                $flag = true;
            }
        }
        if(!$flag){
            return response()->json(["message"=> "Product Doesn't exist in cart"],404);
        }
        $customer->cartProducts()->detach($request->all("products"));
        return response()->json(["message"=>"Product Detatched from cart"],200);
    }

    public function showCutsomerCart($id){
        $customer = Customer::find($id);
        if (!$customer) {
            return response()->json(["message"=> "Customer Doesn't exist"],404);
        }
        $this->authorize('viewCart', $customer);
        $cartProducts = $customer->cartProducts()->with(['images','tags','vendor'])->get();
        return response()->json($cartProducts,200);
    }
    public function clearCart($id){
        $customer = Customer::find($id);
        if (!$customer) {
            return response()->json(["message"=> "Customer Doesn't exist"],404);
        }
        $customer->cartProducts()->detach();

        return response()->json(["message" => "Cart cleared successfully"], 200);
    }
}
