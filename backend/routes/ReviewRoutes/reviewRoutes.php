<?php
// routes/reviewRoutes.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\Review\ReviewController;

Route::group(['prefix' => 'reviews'], function () {
    Route::get('/', [ReviewController::class, 'index']);
    Route::post('/', [ReviewController::class, 'store']);
    Route::get('/{id}', [ReviewController::class, 'show']);
    Route::put('/{id}', [ReviewController::class, 'update']);
    Route::delete('/{id}', [ReviewController::class, 'destroy']);
});



?>
