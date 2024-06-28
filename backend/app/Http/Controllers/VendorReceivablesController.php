<?php

namespace App\Http\Controllers;

use App\Models\VendorReceivables;
use App\Http\Requests\StoreVendorReceivablesRequest;
use App\Http\Requests\UpdateVendorReceivablesRequest;

class VendorReceivablesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
             
            'data' => VendorReceivables::all()
        ], 201);
       
          
    }

   

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVendorReceivablesRequest $request)
    {
         $validatedData = $request->validated();
        $vendorReceivables = VendorReceivables::create($validatedData);
        return response()->json([
            'message' => 'Vendor Receivables created successfully',
            'data' => $vendorReceivables
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(VendorReceivables $vendorReceivables)
    {
        return response()->json([
            'message' => 'Vendor Receivables retrieved successfully',
            'data' => $vendorReceivables
        ], 200);
        

    }

    

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVendorReceivablesRequest $request, VendorReceivables $vendorReceivables)
    {
        $validatedData = $request->validated();
        $vendorReceivables->update($validatedData);
        return response()->json([
            'message' => 'Vendor Receivables updated successfully',
            'data' => $vendorReceivables
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(VendorReceivables $vendorReceivables)
    {
        return $vendorReceivables->delete();
        
    }
}
