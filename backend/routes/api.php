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

    // Public Product & Category & SubCategory APIs
    Route::get('/products', [AdminApiController::class, 'publicProducts']);
    Route::get('/products/{slug}', [AdminApiController::class, 'getProductBySlug']);
    Route::get('/categories', [AdminApiController::class, 'categories']);
    Route::post('/categories', [AdminApiController::class, 'storeCategory']);
    Route::put('/categories/{id}', [AdminApiController::class, 'updateCategory']);
    Route::delete('/categories/{id}', [AdminApiController::class, 'deleteCategory']);

    Route::get('/sub-categories', [AdminApiController::class, 'subCategories']);
    Route::post('/sub-categories', [AdminApiController::class, 'storeSubCategory']);
    Route::put('/sub-categories/{id}', [AdminApiController::class, 'updateSubCategory']);
    Route::delete('/sub-categories/{id}', [AdminApiController::class, 'deleteSubCategory']);

    // Protected Admin Routes (Requires Sanctum Bearer Token & Admin Role)
    Route::middleware(['auth:sanctum', \App\Http\Middleware\EnsureAdminUser::class])->group(function () {
        Route::get('/admin/metrics', [AdminApiController::class, 'dashboardMetrics']);
        Route::get('/admin/categories', [AdminApiController::class, 'categories']);
        Route::post('/admin/categories', [AdminApiController::class, 'storeCategory']);
        Route::put('/admin/categories/{id}', [AdminApiController::class, 'updateCategory']);
        Route::delete('/admin/categories/{id}', [AdminApiController::class, 'deleteCategory']);

        Route::get('/admin/sub-categories', [AdminApiController::class, 'subCategories']);
        Route::post('/admin/sub-categories', [AdminApiController::class, 'storeSubCategory']);
        Route::put('/admin/sub-categories/{id}', [AdminApiController::class, 'updateSubCategory']);
        Route::delete('/admin/sub-categories/{id}', [AdminApiController::class, 'deleteSubCategory']);

        Route::get('/admin/products', [AdminApiController::class, 'products']);
        Route::post('/admin/products', [AdminApiController::class, 'storeProduct']);
        Route::put('/admin/products/{id}', [AdminApiController::class, 'updateProduct']);
        Route::delete('/admin/products/{id}', [AdminApiController::class, 'deleteProduct']);
        Route::get('/admin/orders', [AdminApiController::class, 'orders']);
        Route::put('/admin/orders/{id}/status', [AdminApiController::class, 'updateOrderStatus']);
    });

});
