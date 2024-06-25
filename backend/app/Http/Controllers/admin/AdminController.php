<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\AdminResource;
use App\Models\Admin;
use App\Http\Requests\StoreAdminRequest;
use App\Http\Requests\UpdateAdminRequest;
use App\Traits\AuthTrait;
class AdminController extends Controller
{
    use AuthTrait;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return  AdminResource::collection(Admin::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAdminRequest $request)
    {
        $validatedData = $request->validated();

        if($request->hasfile('image')){
            $validatedData['image'] = $this->uploadImage('image',$request,"admins");
        }
        $validatedData['password'] = bcrypt($validatedData['password']);
        $admin = Admin::create($validatedData);

        

        return response()->json(['message' => 'Admin created successfully', 'admin' => $admin,  ], 201);
    }
    

    /**
     * Display the specified resource.
     */
    public function show(Admin $admin)
    {
        return new AdminResource($admin);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAdminRequest $request, Admin $admin)
    {
        $validatedData =$request->validated();
        if($request->hasfile('image')){
            $validatedData['image'] = $this->uploadImage('image',$request,"admins",$admin);
        }
        $admin->update( $validatedData);
    return response()->json(['message' => 'Admin updated successfully', 'admin' =>  $admin], 201);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Admin $admin)
    {
        if ($admin->image){
            Storage::delete('public/images/admins/'.$admin->image);}
            $admin->delete();
    
    }
}
