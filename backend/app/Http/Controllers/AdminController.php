<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Storage;
// use App\Http\Resources\AdminResource;
use App\Models\Admin;
use App\Http\Requests\StoreAdminRequest;
use App\Http\Requests\UpdateAdminRequest;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Admin::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAdminRequest $request)
    {
        $validatedData = $request->validated();
        
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('public');
            $validatedData['image'] = $imagePath;
        }
        $admin = Admin::create($validatedData);
        
        $imageUrl = $imagePath ? Storage::url($imagePath) : null;
        
        return response()->json(['message' => 'Admin created successfully', 'admin' => $admin, 'image_url' => $imageUrl], 201);
    }
     

    /**
     * Display the specified resource.
     */
    public function show(Admin $admin)
    {
        return $admin;
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAdminRequest $request, Admin $admin)
    {
        $validatedData =$request->validated();
        if($request->hasfile('image')){
            if ($admin->image) {
                Storage::delete($admin->image);
            }
            $imageName = $admin->id. $request->file('image')->getClientOriginalExtension();
            $imagePath = $request->file('image')->storeAs('public', $imageName);
            $validatedData['image'] = $imagePath;
        }
        $admin->update( $validatedData);
    return response()->json(['message' => 'Admin updated successfully', 'admin' =>  $admin], 201);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Admin $admin)
    {
        Storage::delete($admin->image);
        $admin->delete();
    }
}
