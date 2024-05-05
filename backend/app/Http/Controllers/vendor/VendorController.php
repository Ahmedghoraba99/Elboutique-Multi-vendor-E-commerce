<?php

namespace App\Http\Controllers\vendor;

use App\Http\Controllers\Controller;
use App\Http\Resources\VendorResource; 
use App\Models\Vendor;
use App\Http\Requests\StoreVendorRequest;
use App\Http\Requests\UpdateVendorRequest;
use Illuminate\Support\Facades\Storage;

class VendorController extends Controller
{
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
        
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('public');
            $validatedData['image'] = $imagePath;
        }
        if( $request->hasFile('national_id')){
            $imagePath = $request->file('national_id')->store('public');
            $validatedData['national_id'] = $imagePath;
        }
        $vendor = Vendor::create($validatedData);
        
        return response()->json(['message' => 'vendor created successfully', 'vendor' => $vendor], 201);

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
        if ($request->hasFile('image')) {
            if ($vendor->image) {
                Storage::delete($vendor->image);
            }
            $imagePath = $request->file('image')->store('public');
            $validatedData['image'] = $imagePath;
        }
        if( $request->hasFile('national_id')){
            if ($vendor->national_id) {
                Storage::delete($vendor->national_id);
            }
            $imagePath = $request->file('national_id')->store('public');
            $validatedData['national_id'] = $imagePath;
        }
        $vendor->update($validatedData);
        
        return response()->json(['message' => 'Vendor updated successfully', 'vendor' => $vendor], 201);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vendor $vendor)
    {
        if ($vendor->image) {
            Storage::delete($vendor->image);
        }
        
        if ($vendor->national_id) {
            Storage::delete($vendor->national_id);
        }
        $vendor->delete();
    }
}
