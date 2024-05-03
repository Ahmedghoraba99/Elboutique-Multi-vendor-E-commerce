<?php

namespace App\Http\Controllers;
use App\Http\Resources\CustomerResource; 
use App\Models\Customer;
use App\Models\CustomerAddress;
use App\Models\CustomerPhone;
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
        
        // $phones = $validatedData['phones'] ?? [];
    
        if (isset($validatedData['addresses'])) {
            $addresses = $validatedData['addresses'];
            unset($validatedData['addresses']);
        }
        if (isset($validatedData['phones'])) {
            $phones = $validatedData['phones'];
            unset($validatedData['phones']);
        }
    
        $customer = Customer::create($validatedData);
    
        if (!empty($addresses)) {
            $customer->addresses()->createMany($addresses);
        }
    
        if (!empty($phones)) {
            $customer->phones()->createMany($phones);
        }
        return response()->json(['message' => 'Customer created successfully', 'customer' => $customer], 201);
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

        if (isset($validatedData['addresses'])) {
            $addresses = $validatedData['addresses'];
            unset($validatedData['addresses']);
        }
        if (isset($validatedData['phones'])) {
            $phones = $validatedData['phones'];
            unset($validatedData['phones']);
        }
        if (!empty($addresses)) {
            foreach ($addresses as $addressData) {
                 
                if (isset($addressData['id'])) {
                    $address = CustomerAddress::find($addressData['id']);
                    $address->update($addressData);
                } else {
                    $customer->addresses()->create($addressData);
                }
            }
        }
    
        if (!empty($phones)) {
            foreach ($phones as $phoneData) {
                if (isset($phoneData['id'])) {
                    $phone = CustomerPhone::find($phoneData['id']);
                    $phone->update($phoneData);
                } else {
                    $customer->phones()->create($phoneData);
                }
            }
        }
        $customer->update( $validatedData);
    return response()->json(['message' => 'customer updated successfully', 'customer' =>  $customer], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer)
    {
        if($customer->image){
         Storage::delete($customer->image);
        }
        $customer->delete();
        return response()->json(['message' => 'customer deleted successfully', 'admin' =>  $customer], 201);

    }
}
