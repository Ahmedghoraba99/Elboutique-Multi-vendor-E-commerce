<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Http\Requests\StoreReviewRequest;
use App\Http\Requests\UpdateReviewRequest;
use App\Http\Resources\ReviewResource;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
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
        //
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
