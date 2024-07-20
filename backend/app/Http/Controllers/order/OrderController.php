<?php

namespace App\Http\Controllers\order;

use App\Http\Requests\StoreOrderProductRequest;
use App\Models\Order;
use App\Http\Controllers\Controller;
use App\Http\Requests\ChangeStatusOrderRequest;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Customer;
use App\Models\Product;
use App\Models\VendorReceivables;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny',Order::class);
        return OrderResource::collection(Order::with(['products','customer'])->get());
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request)
    {
        $this->authorize('create',Order::class);
        $order= Order::create([
            'customer_id'=>$request->customer_id,
            "total" => $request->total
        ]);
        $order->load('customer');
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
        $order=Order::with(['products','customer','customer.addresses'])->find($id);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }
        $this->authorize('view',$order);

        return response()->json($order,200);
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
        $this->authorize('update',$order);

        $order->update([
            'customer_id'=>$request->customer_id,
            "total" => $request->total,
            "payment_status" => $request->payment_status,

        ]);
        return response()->json(['message' => 'Order updated successfully'], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $order= Order::find($id);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }
        $this->authorize('delete',$order);
        $order->delete();

        return response()->json(["message"=> "Order Deleted"]);
    }

    public function getUserOrders($id){
        $customer = Customer::find($id);
        if (!$customer) {
            return response()->json(["message"=> "Customer Doesn't exist"],404);
        }
        $this->authorize('getUserOrders', $customer);
        $orders = Order::where('customer_id',$id)->with(['products','products.images','customers'])->get();

        return response()->json(["orders"=>$orders]);
    }



    public function changeStatus(ChangeStatusOrderRequest $request, Order $order)
    {

        DB::beginTransaction();

        try {
            $order->update(['status' => $request->status]);

            if ($request->status === 'arrived') {
                $order->load('products.vendor.vendorReceivables');

                foreach ($order->products as $product) {
                    $vendor = $product->vendor;
                    if ($vendor) {
                        $vendorReceivables = $vendor->vendorReceivables()->firstOrNew([
                            'vendor_id' => $vendor->id
                        ]);

                        $vendorReceivables->amount += $product->price;
                        $vendorReceivables->save();
                    }
                }
            }

            DB::commit();
            return response()->json(['message' => 'Order status updated successfully'], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to update order status.', 'error' => $e->getMessage()], 500);
        }
    }

    public function cancelOrder(int $id){
        $order=Order::with(['products'])->find($id);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }
        if($order->status === 'midway'){
            $pivots = $order->products->map(function ($product) {
                return [
                    'order_id' => $product->pivot->order_id,
                    'product_id' => $product->pivot->product_id,
                    'quantity' => $product->pivot->quantity
                ];
            });
            foreach ($pivots as $key => $pivot) {
                $product = Product::find($pivot['product_id']);
                $product->stock += $pivot['quantity'];
                $product->save();
            }
            $order->status = 'cancelled';
            $order->save();
            return response()->json(['msg'=>"Order cancelled"],200);
        }else if($order->status === 'cancelled'){
            return response()->json(['msg'=>"Order already cancelled"]);
        }
        else{
            return response()->json(['msg'=>"can't cancel this order"]);
        }
    }

}
