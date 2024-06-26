<?php

namespace App\Http\Controllers\vendor;

use App\Http\Controllers\Controller;
use App\Http\Resources\VendorResource;
use App\Models\Vendor;
use App\Http\Requests\StoreVendorRequest;
use App\Http\Requests\UpdateVendorRequest;
use Illuminate\Support\Facades\Storage;
use App\Traits\AuthTrait;
use Illuminate\Auth\Events\Registered;

class VendorController extends Controller
{
    use AuthTrait;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return VendorResource::collection(Vendor::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVendorRequest $request)
    {
        $validatedData = $request->validated();

        if($request->hasfile('image')){
            $validatedData['image'] = $this->uploadImage('image',$request,"vendors");
        }
        if( $request->hasFile('national_id')){
            $validatedData['national_id'] = $this->uploadImage('national_id',$request,"vendors/national_id");
        }
        $validatedData['password'] = bcrypt($validatedData['password']);
        $vendor = Vendor::create($validatedData);
        event(new Registered($vendor));
        return $this->sendSuccessResponse("created successfully we sent a verification email to you please check your inbox",$vendor);
        // return response()->json(['message' => 'vendor created successfully we sent a verification email to you please check your inbox', 'vendor' => $vendor], 201);

    }

    /**
     * Display the specified resource.
     */
    public function show(Vendor $vendor)
    {
        return new VendorResource($vendor);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVendorRequest $request, Vendor $vendor)
    {
        $validatedData = $request->validated();
        if($request->hasfile('image')){
            $validatedData['image'] = $this->uploadImage('image',$request,"vendors",$vendor);
        }

        if( $request->hasFile('national_id')){

            $validatedData['national_id'] = $this->uploadImage('national_id',$request,"vendors/national_id",$vendor);
        }
        $vendor->update($validatedData);
        return $this->sendSuccessResponse("Vendor updated successfully",$vendor);

        // return response()->json(['message' => 'Vendor updated successfully', 'vendor' => $vendor], 201);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vendor $vendor)
    {


        if ($vendor->image) {

            Storage::delete('public/images/vendors/'.$vendor->image);
        }

        if ($vendor->national_id) {
            Storage::delete('public/images/vendors/national_id'.$vendor->national_id);
        }
        $vendor->delete();
    }

   public function activateVendor(Vendor $vendor)
{

    return  $this->updateUserStatus($vendor,'active');


}
   public function banVendor(Vendor $vendor)
{
    return  $this->updateUserStatus($vendor,"banned");


}


}
