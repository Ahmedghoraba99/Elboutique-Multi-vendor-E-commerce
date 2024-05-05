<?php

namespace App\Http\Controllers\customer;
use App\Http\Resources\CustomerPhoneResource; 
use App\Http\Controllers\Controller;
use App\Models\CustomerPhone;
use App\Http\Requests\StoreCustomerPhoneRequest;
use App\Http\Requests\UpdateCustomerPhoneRequest;

class CustomerPhoneController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return CustomerPhoneResource::collection(CustomerPhone::all()); 
    }

    

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCustomerPhoneRequest $request)
    {
        $validatedData = $request->validated();
        $customerPhone = CustomerPhone::create( $validatedData);
        return new CustomerPhoneResource($customerPhone);
    }

    /**
     * Display the specified resource.
     */
    public function show(CustomerPhone $customerphone)
    {
        return new CustomerPhoneResource($customerphone); 
    }

     

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCustomerPhoneRequest $request, CustomerPhone $customerphone)
    {
        $validatedData = $request->validated();
        $customerphone->update($validatedData);
        return new CustomerPhoneResource($customerphone);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CustomerPhone $customerphone)
    {
        
         return  $customerphone->delete();
    }
}
