<?php

namespace App\Http\Controllers\API\Review;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;
use App\Http\Requests\StoreReviewRequest;
use App\Http\Requests\UpdateReviewRequest;
use App\Http\Resources\ReviewResource;


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
        $review = Review::find($id);
        return new ReviewResource($review);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReviewRequest $request, Review $review)
    {

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Review $review,$id)
    {

        $review = Review::find($id);
        $review->delete();
        return new ReviewResource($review);
    }
}
