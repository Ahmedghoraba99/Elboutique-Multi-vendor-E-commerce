<?php

namespace App\Http\Controllers\tag;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTagRequest;
use App\Http\Requests\UpdateTagRequest;
use App\Models\Product;
use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tags = Tag::paginate(10);
        if (!$tags->count()) {
            return response()->json([
                'message' => 'No tags found'
            ], 404);
        }
        return response()->json($tags);
    }

    public function getAllTags(Request $request, $product_id = null)
    {
        $tags = Tag::all();

        if ($product_id) {
            $product = Product::findOrFail($product_id);
            $tags->each(function ($tag) use ($product) {
                $tag->selected = $product->tags->contains($tag);
            });
        }

        return response()->json([
            'success' => true,
            'data' => $tags,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTagRequest $request)
    {
        try {
            $tag = Tag::create($request->validated());
            return response()->json($tag, 201);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Error creating tag', 'error' => $th->getMessage()
            ], 500);
        };
    }

    /**
     * Display the specified resource.
     */
    public function show(int $tag)
    {
        $tag = Tag::find($tag);
        if (!$tag) {
            return response()->json([
                'message' => 'Tag not found'
            ], 404);
        }
        return response()->json($tag);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTagRequest $request, Tag $tag)
    {
        // return response()->json($tag);
        $tag->updateOrFail($request->validated());
        return response()->json($tag, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $tag)
    {
        $tag = Tag::find($tag);
        if (!$tag) {
            return response()->json([
                'message' => 'Tag not found'
            ], 404);
        }
        $tag->delete();
        return response()->json([
            'message' => 'Tag deleted'
        ], 200);
    }
}
