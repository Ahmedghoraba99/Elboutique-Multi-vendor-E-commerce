<?php

namespace App\Http\Controllers\customer;
use App\Http\Resources\CustomerAddressResource; 
use App\Http\Controllers\Controller;
use App\Models\CustomerAddress;
use App\Http\Requests\StoreCustomerAddressRequest;
use App\Http\Requests\UpdateCustomerAddressRequest;

class CustomerAddressController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return  CustomerAddressResource::collection(CustomerAddress::all());
    }

  
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCustomerAddressRequest $request)
    {  
        $validatedData = $request->validated();
        $customerAddress = CustomerAddress::create($validatedData);
        return new CustomerAddressResource($customerAddress);
    }

    /**
     * Display the specified resource.
     */
    public function show(CustomerAddress $customeraddress)
    {
          return new CustomerAddressResource($customeraddress);
         
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCustomerAddressRequest $request, CustomerAddress $customeraddress)
    {
        $validatedData = $request->validated();
        $customeraddress->update($validatedData);
        return new CustomerAddressResource($customeraddress);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CustomerAddress $customeraddress)
    {
         return  $customeraddress->delete();
    }
}
