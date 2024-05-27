<?php

namespace App\Http\Controllers\API\Report;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\ReportProductResource;
use App\Models\ReportProduct;
use App\Http\Requests\StoreReportPrductRequest;
use App\Http\Requests\UpdateReportPrductRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;


class ReportProductController extends Controller
{
    //
    public function index()
    {
        $reportProducts = ReportProduct::all();
        return ReportProductResource::collection($reportProducts);
    }

    public function store(StoreReportPrductRequest $request)
    {
        $validated = $request->validated();
        $review = ReportProduct::create($validated);
        // Return custom response
        return response()->json([
            'message' => 'Report About Product created successfully',
            'Report' => new ReportProductResource($review)
        ], 201);
    }

    public function show($id)
    {
        try {
            $review = ReportProduct::findOrFail($id);
            return new ReportProductResource($review);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Report not found'
            ], 404);
        }catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to get Report'
            ], 500);
        }
    }

    public function update(UpdateReportPrductRequest $request, $id)
    {
        try {
            // Find the review by ID
            $review = ReportProduct::findOrFail($id);
            $review->update($request->validated());
            return response()->json([
                'message' => 'Report Product updated successfully',
                'report' => new ReportProductResource($review)
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Report Product not found'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update Report'
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $review = ReportProduct::findOrFail($id);
            $review->delete();

            return response()->json([
                'message' => 'Report Product deleted successfully',
                "data" => new ReportProductResource($review)
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Report Product not found'
            ], 404);
        }
    }
}
