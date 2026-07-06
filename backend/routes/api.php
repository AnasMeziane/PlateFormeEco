<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ShopController;
use App\Http\Controllers\Api\WhatsAppController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\SiteSettingController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\Api\Admin\ProductController;
use App\Http\Controllers\Api\Admin\WhatsAppOrderController;
use App\Http\Controllers\Api\Admin\CustomerController;
use App\Http\Controllers\Api\Admin\PageController;
use App\Http\Controllers\Api\SocialLinkController;

/*
|--------------------------------------------------------------------------
| Public API Routes (Client-facing)
|--------------------------------------------------------------------------
*/
Route::get('/home', [ShopController::class, 'home']);
Route::get('/products', [ShopController::class, 'products']);
Route::get('/products/{product}', [ShopController::class, 'product']);
Route::get('/categories', [ShopController::class, 'categories']);
Route::get('/pages/{slug}', [ShopController::class, 'page']);
Route::post('/contact', [ContactController::class, 'send']);
Route::post('/whatsapp-order', [WhatsAppController::class, 'submitOrder']);
Route::get('/site-settings', [SiteSettingController::class, 'index']);
Route::get('/social-links', [SocialLinkController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Admin Protected Routes (Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::prefix('admin')->group(function () {
        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'stats']);

        // Categories CRUD
        Route::apiResource('/categories', CategoryController::class);

        // Products CRUD
        Route::apiResource('/products', ProductController::class);
        Route::delete('/product-images/{image}', [ProductController::class, 'deleteImage']);
        Route::put('/products/{product}/main-image/{image}', [ProductController::class, 'setMainImage']);

        // WhatsApp Orders
        Route::get('/whatsapp-orders', [WhatsAppOrderController::class, 'index']);
        Route::get('/whatsapp-orders/{whatsappOrder}', [WhatsAppOrderController::class, 'show']);
        Route::put('/whatsapp-orders/{whatsappOrder}/status', [WhatsAppOrderController::class, 'updateStatus']);
        Route::delete('/whatsapp-orders/{whatsappOrder}', [WhatsAppOrderController::class, 'destroy']);

        // Customers
        Route::get('/customers', [CustomerController::class, 'index']);
        Route::get('/customers/{customer}', [CustomerController::class, 'show']);
        Route::delete('/customers/{customer}', [CustomerController::class, 'destroy']);

        // Site Settings
        Route::put('/site-settings', [SiteSettingController::class, 'update']);

        // Pages CMS
        Route::get('/pages', [PageController::class, 'index']);
        Route::get('/pages/{page}', [PageController::class, 'show']);
        Route::put('/pages/{page}', [PageController::class, 'update']);

        // Social Links Management
        Route::get('/social-links', [SocialLinkController::class, 'adminIndex']);
        Route::put('/social-links/{socialLink}', [SocialLinkController::class, 'update']);
        Route::put('/social-links', [SocialLinkController::class, 'bulkUpdate']);
        Route::post('/social-links', [SocialLinkController::class, 'store']);
        Route::delete('/social-links/{socialLink}', [SocialLinkController::class, 'destroy']);
    });
});
