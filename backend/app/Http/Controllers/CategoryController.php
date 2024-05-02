<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;

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


    public function store(StoreCategoryRequest $category)
    {
        try {
            $category = Category::create($category->validated());
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
        $category->update($request->validated());
        return response()->json($category);
    }


    public function destroy(Category $category)
    {
        $category->delete();
        return response()->json("Deleted", 204);
    }
}
