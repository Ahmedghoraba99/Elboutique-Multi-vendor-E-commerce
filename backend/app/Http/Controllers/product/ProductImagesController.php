<?php

namespace App\Http\Controllers\product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Storeproduct_imagesRequest;
use App\Http\Requests\Updateproduct_imagesRequest;
use App\Models\product_images;

class ProductImagesController extends Controller
{

    // Not needed currently
    // public function index()
    // {
    // }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Storeproduct_imagesRequest $request)
    {
        $request->validate();
        try {
            $image = product_images::create([
                'product_id' => $request->product_id,
                'image' => $request->file('image')->store('product_images'),
            ]);
            return response()->json(['message' => 'Image uploaded successfully'], 201);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Image upload failed'], 500);
        }
    }

    public function show(int $product_images)
    {
        $product_images
            = product_images::where('product_id', $product_images)
            ->get();
        if (!$product_images->count()) {
            return response()->json(['message' => 'No images found for this product'], 404);
        }
        return response()->json($product_images, 200);
    }

    public function update(Updateproduct_imagesRequest $request, product_images $product_images)
    {
        $product_images
            = product_images::where('product_id', $product_images)
            ->where('id', $product_images)
            ->first();
        if (!$product_images) {
            return response()->json(['message' => 'No images found for this product'], 404);
        }
        $product_images->update($request->all());
        return response()->json(['message' => 'Image updated successfully'], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $product_images, int $product_id)
    {

        $product_images
            = product_images::where('product_id', $product_id)
            ->where('id', $product_images)
            ->first();
        if (!$product_images) {
            return response()->json(['message' => 'No images found for this product'], 404);
        }
        $product_images->delete();
        return response()->json(['message' => 'Image deleted successfully'], 200);
    }
}
