<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\Report\ReportProductController;


Route::group(['prefix' => 'report-products'], function () {
    Route::get('/', [ReportProductController::class, 'index']);
    Route::get('/{id}', [ReportProductController::class, 'show']);
    Route::get('customer/{id}', [ReportProductController::class, 'getReportByCustomer']);
});
Route::group(['prefix' => 'report-products','middleware' => ['auth:sanctum','AdminCustomerAuth']], function () {
    Route::post('/', [ReportProductController::class, 'store']);
    Route::put('/{id}', [ReportProductController::class, 'update']);
    Route::delete('/{id}', [ReportProductController::class, 'destroy']);
});
