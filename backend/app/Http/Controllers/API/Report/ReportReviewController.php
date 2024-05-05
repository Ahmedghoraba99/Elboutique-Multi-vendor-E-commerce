<?php

namespace App\Http\Controllers\API\Report;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ReportReview;
use App\Http\Resources\ReportReviewResource;
use App\Http\Requests\StoreReportReviewRequest;
use App\Http\Requests\UpdateReportReviewRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;


class ReportReviewController extends Controller
{
    public function index(){
        $reportReviews = ReportReview::all();
        return ReportReviewResource::collection($reportReviews);
    }

    public function store(StoreReportReviewRequest $request)
    {
        $validated = $request->validated();
        if ($request->fails()) {
            return response()->json(['error' => $request->errors()->first()], 422);
        }
        $review = ReportReview::create($validated);
        // Return custom response
        return response()->json([
            'message' => 'Report About Review created successfully',
            'Report' => new ReportReviewResource($review)
        ], 201);
    }

    public function show($id){
        try {
            $review = ReportReview::findOrFail($id);
            return new ReportReviewResource($review);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Report not found'
            ], 404);
        }
    }

    public function update(UpdateReportReviewRequest $request, $id){
        try {
            // Find the review by ID
            $review = ReportReview::findOrFail($id);
            $review->update($request->validated());
            return response()->json([
                'message' => 'Report Review updated successfully',
                'report' => new ReportReviewResource($review)
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Report Review not found'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update Report'
            ], 500);
        }
    }

    public function destroy($id){
        try {
            $review = ReportReview::findOrFail($id);
            $review->delete();

            return response()->json([
                'message' => 'Report Review deleted successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Report Review not found'
            ], 404);
        }
    }

}
