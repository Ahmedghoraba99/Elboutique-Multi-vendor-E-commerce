<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreattributesRequest;
use App\Http\Requests\UpdateattributesRequest;
use App\Models\attributes;

class AttributesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreattributesRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(attributes $attributes)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateattributesRequest $request, attributes $attributes)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(attributes $attributes)
    {
        //
    }
}
