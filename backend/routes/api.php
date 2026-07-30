<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminApiController;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes for Shopia E-Commerce
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // Individual Public Auth APIs
    Route::post('/customer/register', [AuthController::class, 'registerCustomer']);
    Route::post('/customer/login', [AuthController::class, 'loginCustomer']);
    Route::post('/admin/register', [AuthController::class, 'registerAdmin']);
    Route::post('/admin/login', [AuthController::class, 'loginAdmin']);

    // Public Product APIs
    Route::get('/products', [AdminApiController::class, 'publicProducts']);
    Route::get('/products/{slug}', [AdminApiController::class, 'getProductBySlug']);

    // Protected Admin Routes (Requires Sanctum Bearer Token & Admin Role)
    Route::middleware(['auth:sanctum', \App\Http\Middleware\EnsureAdminUser::class])->group(function () {
        Route::get('/admin/metrics', [AdminApiController::class, 'dashboardMetrics']);
        Route::get('/admin/categories', [AdminApiController::class, 'categories']);
        Route::post('/admin/categories', [AdminApiController::class, 'storeCategory']);
        Route::get('/admin/products', [AdminApiController::class, 'products']);
        Route::post('/admin/products', [AdminApiController::class, 'storeProduct']);
        Route::put('/admin/products/{id}', [AdminApiController::class, 'updateProduct']);
        Route::delete('/admin/products/{id}', [AdminApiController::class, 'deleteProduct']);
        Route::get('/admin/orders', [AdminApiController::class, 'orders']);
        Route::put('/admin/orders/{id}/status', [AdminApiController::class, 'updateOrderStatus']);
    });

});
