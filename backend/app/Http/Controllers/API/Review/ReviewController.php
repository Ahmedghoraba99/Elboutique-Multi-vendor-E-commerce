<?php

namespace App\Http\Controllers\API\Review;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;
use App\Http\Requests\StoreReviewRequest;
use App\Http\Requests\UpdateReviewRequest;
use App\Http\Resources\ReviewResource;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;



class ReviewController extends Controller
{
    public function index()
    {
        $reviews = Review::all();
        return ReviewResource::collection($reviews);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReviewRequest $request)
    {
        $validated = $request->validated();
        if ($request->fails()) {
            return response()->json(['error' => $request->errors()->first()], 422);
        }
        $review = Review::create($validated);
        // Return custom response
        return response()->json([
            'message' => 'Review created successfully',
            'review' => new ReviewResource($review)
        ], 201);

    }

    /**
     * Display the specified resource.
     */
    public function show(Review $review , $id)
    {
        try {
            $review = Review::findOrFail($id);
            return new ReviewResource($review);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Review not found'
            ], 404);
        }
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReviewRequest $request, $id)
    {
        try {
            // Find the review by ID
            $review = Review::findOrFail($id);
            $review->update($request->validated());
            return response()->json([
                'message' => 'Review updated successfully',
                'review' => new ReviewResource($review)
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Review not found'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update review'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Review $review,$id)
    {
        try {
            $review = Review::findOrFail($id);
            $review->delete();

            return response()->json([
                'message' => 'Review deleted successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Review not found'
            ], 404);
        }
    }
}
