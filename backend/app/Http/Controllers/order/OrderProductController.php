<?php

namespace App\Http\Controllers\order;

use App\Http\Requests\StoreOrderProductRequest;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;


class OrderProductController extends Controller
{
    public function addProductToOrder(Request $request,$id){
        $order=Order::find($id);
        if (!$order) {
            return response()->json(["message"=> "Order Doesn't exist"],404);
        }
        $products=[];
        foreach($request->products as $product_id => $quantity){
            $product=Product::find($product_id);
            if(!$product){
            return response()->json(["message"=> "Product Doesn't exist"],404);
            }
            $products[$product_id]=["quantity" => $quantity];
        }        
        $order->products()->attach($products);
        return response()->json(['message'=> 'Products added to Order'], 200);
    }
    public function deleteProductFromOrder(Request $request, $id){
        $order=Order::find($id);
        if (!$order) {
            return response()->json(["message"=> "Order Doesn't exist"],404);
        }
        $product=Product::find($request->all()['product']);
        $flag = false;
        foreach ($order->products as $key => $orderProduct) {
            if($product->id === $orderProduct->id){
                $flag = true;
            }
        }
        if(!$flag){
            return response()->json(["message"=> "Product Doesn't exist in order"],404);
        }
        $order->products()->detach($product);
        return response()->json(['message'=> 'Products deleted from Order'], 200);
    }
    public function getOrderProduct($id){
        $order=Order::find($id);
        if (!$order) {
            return response()->json(["message"=> "Order Doesn't exist"],404);
        }
        $orderProducts = $order->products()->with(['images','tags','vendor'])->get();
        return response()->json(['order_product'=>$orderProducts],200);
    }

    
}
