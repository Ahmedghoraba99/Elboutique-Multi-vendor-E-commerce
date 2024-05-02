<?php

namespace App\Http\Controllers;
use App\Http\Resources\CustomerResource; 
use App\Models\Customer;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use Illuminate\Support\Facades\Storage;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return CustomerResource::collection(Customer::all());
    }

    

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCustomerRequest $request)
    {
        $validatedData = $request->validated();
        
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('public');
            $validatedData['image'] = $imagePath;
        }
        
        $customer = Customer::create($validatedData);
        
        return response()->json(['message' => 'customer created successfully', 'customer' => $customer], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer)
    {
        return new CustomerResource($customer);
    }

 
    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        $validatedData =$request->validated();
        if($request->hasfile('image')){
            if ($customer->image) {
                Storage::delete($customer->image);
            }
            $imageName = $customer->id. $request->file('image')->getClientOriginalExtension();
            $imagePath = $request->file('image')->storeAs('public', $imageName);
            $validatedData['image'] = $imagePath;
        }
        $customer->update( $validatedData);
    return response()->json(['message' => 'customer updated successfully', 'customer' =>  $customer], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer)
    {
        Storage::delete($customer->image);
        $customer->delete();
        return response()->json(['message' => 'customer deleted successfully', 'admin' =>  $customer], 201);

    }
}
