<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderProductRequest;
use App\Models\Order;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Product;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return OrderResource::collection(Order::all());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request)
    {
        $order= Order::create([
            'customer_id'=>$request->customer_id,
            'status'=>$request->status,
        ]);
        return response()->json([
            "message" => 'Order Added',
            "order" => $order
        ],201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $order=Order::find($id);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }
        return new OrderResource($order);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreOrderRequest $request, $id)
    {
        $order= Order::find($id);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }
        $order->update([
            'customer_id'=>$request->customer_id,
            'status'=>$request->status,
        ]);
        return response()->json(['message' => 'Order updated successfully'], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {

        // $order->deleteOrFail();
        $deleted = Order::destroy($id);
        if ($deleted === 0) {
            return response()->json(['message' => "Order Doesn't Exist"], 404);
        }
        return response()->json(["message"=> "Order Deleted"]);
    }

    
}
