<?php

namespace App\Http\Controllers\customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\CustomerResource; 
use App\Models\Customer;
use App\Models\CustomerAddress;
use App\Models\CustomerPhone;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
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
        DB::beginTransaction();
        try {
        $validatedData = $request->validated();
        if ($request->hasFile('image')) {
            $validatedData['image'] = $this->uploadImage($request);
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

        DB::commit();
        return response()->json(['message' => 'Customer created successfully', 'customer' => $customer], 201);
    } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
    }
   
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
        DB::beginTransaction();
        try {
        $validatedData =$request->validated();
        if($request->hasfile('image')){
            $validatedData['image'] = $this->uploadImage($request,$customer);
        }

        if (isset($validatedData['addresses'])) {
            $addresses = $validatedData['addresses'];
            unset($validatedData['addresses']);
        }
        if (isset($validatedData['phones'])) {
            $phones = $validatedData['phones'];
            unset($validatedData['phones']);
        }
    $updateAddressesResult=$this->updateAddresses($addresses,$customer);
    if($updateAddressesResult=='unauthorized'){
        return response()->json(['message' => 'The current customer is unauthorized to update this address. Customers can only update their own addresses.' ]);
    }
    $updatePhonesResult=$this->updatePhons($phones,$customer);
    if($updatePhonesResult=='unauthorized'){
        return response()->json(['message' => 'The current customer is unauthorized to update this phone. Customers can only update their own phones.' ]);
    }
    $customer->update( $validatedData);
    DB::commit();
    return response()->json(['message' => 'customer updated successfully', 'customer' =>  $customer], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 500);
        }
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

    public function uploadImage($request,$customer=null){
        $imagePath="";
        if ($customer!=null and $customer->image) {
            Storage::delete($customer->image);
            $imageName = $customer->id. $request->file('image')->getClientOriginalExtension();
            $imagePath = $request->file('image')->storeAs('public', $imageName);
        }else{
            $imagePath = $request->file('image')->store('public');
        }
        return  $imagePath;
    }
    public function updateAddresses($addresses,$customer){
        if (!empty($addresses)) {
            foreach ($addresses as $addressData) {
                 
                if (isset($addressData['id'])) {
                    $customersAddresses=$customer->addresses()->pluck('id')->toArray();
                    if(in_array($addressData['id'], $customersAddresses)){
                    $address = CustomerAddress::find($addressData['id']);
                    $address->update($addressData);}
                    else{
                        return 'unauthorized';
                    }
                } else {
                    $customer->addresses()->create($addressData);
                }
            }
        }
    }
    public function updatePhons($phones,$customer){
        if (!empty($phones)) {
            foreach ($phones as $phoneData) {
                if (isset($phoneData['id'])) {
                   $customersPhons=$customer->phones()->pluck('id')->toArray();
                    if(in_array($phoneData['id'], $customersPhons)){
                    $phone = CustomerPhone::find($phoneData['id']);
                    $phone->update($phoneData);}
                    else{
                        return 'unauthorized';
                    }
                } else {
                    $customer->phones()->create($phoneData);
                }
            }
        }
    }

}
