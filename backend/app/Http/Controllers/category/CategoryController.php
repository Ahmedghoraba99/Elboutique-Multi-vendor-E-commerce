<?php

namespace App\Http\Controllers\category;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{

    public function index()
    {
        $categories = Category::paginate(15);
        if (!$categories->count()) {
            return response()->json("No categories found", 404);
        }
        // return response()->json($categories);
        return response()->json($categories);
    }


    public function store(StoreCategoryRequest $request)
    {
        try {
            $validatedData = $request->validated();

            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('categories', 'public');
                $validatedData['image'] = $path;
            }

            $category = Category::create($validatedData);

            return response()->json($category);
        } catch (\Exception $e) {
            return response()->json($e->getMessage(), 400);
        }
    }


    public function show(int $category)
    {
        $category = Category::find($category);
        if (!$category) {
            return response()->json("Category not found", 404);
        }
        return response()->json($category);
    }


    public function update(UpdateCategoryRequest $request, Category $category)
    {
        try {
            $validatedData = $request->validated();
            if ($request->hasFile('image')) {
                if ($category->image){
                     Storage::delete('public/categories'. $category->image);
                }
                $path = $request->file('image')->store('categories', 'public');
                $validatedData['image'] = $path;
            }

            $category->updateOrFail($validatedData);
            return response()->json($category);
        } catch (\Exception $e) {
            return response()->json($e->getMessage(), 400);
        }
    }


    public function destroy(Category $category)
    {
        $category->delete();
        return response()->json("Deleted", 204);
    }
}
