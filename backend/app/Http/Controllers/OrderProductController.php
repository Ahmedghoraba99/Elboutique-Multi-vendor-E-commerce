<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderProductRequest;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;

class OrderProductController extends Controller
{
    public function addProductToOrder(StoreOrderProductRequest $request,$id){
        $order=Order::find($id);
        if (!$order) {
            return response()->json(["message"=> "Order Doesn't exist"],404);
        }
        $product=Product::find($request->product_id);
        if (!$product) {
            return response()->json(["message"=> "Product Doesn't exist"],404);
        }
        $order->products()->attach($product->id, ['quantity' => $request->quantity]);
        return response()->json(['message'=> 'Prodcut added to Order'], 200);
    }
    public function getOrderProduct($id){
        $order=Order::find($id);
        if (!$order) {
            return response()->json(["message"=> "Order Doesn't exist"],404);
        }
        return $order->products;
    }
}
