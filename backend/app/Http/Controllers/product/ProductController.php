<?php

namespace App\Http\Controllers\product;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use App\Models\product_images;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // get all products with images and tags
        $products = Product::with(['images', 'tags'])->paginate(15);
        return response()->json($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        try {
            $images = $request->images;
            // Create a new product instance and populate it with request data
            $product = new Product();
            $product->name = $request->name;
            $product->description = $request->description;
            $product->price = $request->price;
            $product->category_id = $request->category_id;
            $product->vendor_id = $request->vendor_id;
            $product->stock = $request->stock;

            // Save the product to the database
            $product->save();

            // Check if images are present in the request
            if ($images && is_array($images)) {
                // Multiple image handling
                foreach ($images as $image) {
                    // Create a new instance for each image
                    $productImage = new product_images();
                    // Store the image and get the path
                    $imagePath = $image->store('products', 'public');
                    $imagePath = str_replace('public/', 'storage/', $imagePath);

                    // Save the image path to the database
                    $productImage->product_id = $product->id;
                    $productImage->image = $imagePath;
                    $productImage->save();
                }
            }

            // Multiple tag handling
            if ($request->tags && is_array($request->tags)) {
                $product->tags()->attach($request->tags);
            }

            return response()->json($product);
        } catch (\Throwable $th) {
            // Rollback by deleting the created product and related images if any error occurs
            if (isset($product->id)) {
                Product::where('id', $product->id)->delete();
                product_images::where('product_id', $product->id)->delete();
            }
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }


    /**
     * Display the specified resource.
     */
    public function getProductsByCategory(int $categoryId)
    {
        $products = Product::where('category_id', $categoryId)->paginate(15);
        return response()->json($products);
    }
    // Custom
    public function getProductsByTag(int $tagId)
    {
        $products = Product::whereHas('tags', function ($query) use ($tagId) {
            $query->where('tags.id', $tagId);
        })->paginate(15);
        return response()->json($products);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $product)
    {
        $product = Product::with('images')->find($product);
        return response()->json($product);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        try {
            // Update product details
            $product->update($request->validated());

            // Update images if provided
            if ($request->hasFile('images')) {
                // Delete existing images associated with the product
                $product->images()->delete();

                // Upload new images and associate with the product
                foreach ($request->file('images') as $image) {
                    $imagePath = $image->store('public/images/products');
                    $productImage = new product_images();
                    $productImage->product_id = $product->id;
                    $productImage->image_path = $imagePath;
                    $productImage->save();
                }
            }

            // Update tags if provided
            if ($request->filled('tags')) {
                $product->tags()->sync($request->tags);
            } else {
                // If no tags provided, detach all existing tags
                $product->tags()->detach();
            }

            // Save the updated product
            $product->save();

            return response()->json($product);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            // Find the product by ID
            $product = Product::findOrFail($id);

            $product->images()->delete();

            $product->tags()->detach();
            $product->delete();

            return response()->json(['message' => 'Product deleted successfully']);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function getFeaturedProducts()
    {
        try {
            $products = Product::where('is_featured', true)
                ->with('images')
                ->with('tags')
                ->get();

            return response()->json($products);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function featureAndUnfeatureProduct(int $id)
    {
        try {
            // Find the product by ID
            $product = Product::findOrFail($id);

            // Toggle the is_featured flag
            $product->is_featured = !$product->is_featured;
            $product->save();

            return response()->json(['message' => 'Product featured status updated successfully']);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function getProductsOnSale()
    {
        try {
            $products = Product::where('sale', '>', 0)
                ->with('images')
                ->with('tags')
                ->with("vendor")
                ->orderBy('sale', 'desc')
                ->get();

            return response()->json($products);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function getNewArrivalProducts()
    {

        try {
            $products = Product::where('created_at', '>', now()->subDays(7))
                ->with('images')
                ->with('tags')
                ->get();

            return response()->json($products);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }
}
