<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\Report\ReportReviewController;


Route::group(['prefix' => 'report-reviews'], function () {
    Route::get('/', [ReportReviewController::class, 'index']);
    Route::get('/{id}', [ReportReviewController::class, 'show']);
});

Route::group(['prefix' => 'report-reviews','middleware' => ['auth:sanctum']], function () {
    Route::post('/', [ReportReviewController::class, 'store']);
    Route::put('/{id}', [ReportReviewController::class, 'update']);
    Route::delete('/{id}', [ReportReviewController::class, 'destroy']);
});
