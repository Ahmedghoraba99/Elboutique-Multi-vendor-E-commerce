<?php

namespace App\Http\Controllers\customer;
use App\Http\Controllers\Controller;
use App\Http\Resources\CustomerResource; 
use App\Models\Customer;
use App\Models\CustomerAddress;
use App\Models\CustomerPhone;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Traits\AuthTrait;
class CustomerController extends Controller
{
    use AuthTrait;
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
        
        if($request->hasfile('image')){
            $validatedData['image'] = $this->uploadImage('image',$request,"customers");
        }
        $validatedData['password'] = bcrypt($validatedData['password']);
        // $phones = $validatedData['phones'] ?? [];

        $customer = Customer::create($validatedData);
        $addresses=$this->checkForAddressesExisting($validatedData);
        if (!empty($addresses)) {
            // return response()->json( $addresses);
            $customer->addresses()->createMany($addresses);
        }
        $phones=$this->checkForPhonesExisting($validatedData);
        if (!empty($phones)) {
            $customer->phones()->createMany($phones);
        }

        DB::commit();
        event(new Registered($customer));
        return response()->json(['message' => 'Customer created successfully we sent a verification email to you please check your inbox', 'customer' => $customer], 201);
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
        // dd($customer);
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
            $validatedData['image'] = $this->uploadImage('image',$request,"customers",$customer);
        }
        $addresses=$this->checkForAddressesExisting($validatedData);   
        $updateAddressesResult=$this->updateAddresses($addresses,$customer);
        if($updateAddressesResult=='unauthorized'){
            DB::rollBack();
            return response()->json(['message' => 'The current customer is unauthorized to update this address. Customers can only update their own addresses.' ]);
        }

        $phones=$this->checkForPhonesExisting($validatedData);
        $updatePhonesResult=$this->updatePhons($phones,$customer);
        if($updatePhonesResult=='unauthorized'){
            DB::rollBack();
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
        Storage::delete('public/images/customers/'.$customer->image);
        }
        $customer->delete();
        return response()->json(['message' => 'customer deleted successfully', 'admin' =>  $customer], 201);

    }

    public function checkForAddressesExisting(&$validatedData){
        if (isset($validatedData['addresses'])) {
             
            $addresses = $validatedData['addresses'];
            unset($validatedData['addresses']);
            return $addresses;
        }
        else{
            return;
        }

    }
    public function checkForPhonesExisting(&$validatedData){
        if (isset($validatedData['phones'])) {
            $phones = $validatedData['phones'];
            unset($validatedData['phones']);
            return $phones;
        }
        else{
            return;
        }

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
