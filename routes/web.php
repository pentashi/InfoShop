<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\CollectionController;
use App\Http\Controllers\POSController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\QuantityController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    Route::get('/stores', [StoreController::class, 'index'])->name('store');
    Route::post('/store', [StoreController::class, 'store']);
    Route::put('/store/{id}', [StoreController::class, 'update']);

    Route::get('/collections', [CollectionController::class, 'index'])->name('collection');
    Route::post('/collection', [CollectionController::class, 'store']);
    Route::put('/collection/{id}', [CollectionController::class, 'update']);

    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
    Route::get('/products/{id}/edit', [ProductController::class, 'find'])->name('products.find');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::post('/products/{id}', [ProductController::class, 'update'])->name('products.update');
    Route::get('/products/search', [ProductController::class, 'searchProduct'])->name('products.search');
    Route::post('/storebatch', [ProductController::class, 'storeNewBatch'])->name('products.newbatch');
    Route::post('/productbatch/{id}', [ProductController::class, 'updateBatch'])->name('products.updatebatch');
    Route::get('/getproducts/{store_id}', [ProductController::class, 'getProductsResponse'])->name('products.getproducts');

    Route::get('/pos', [POSController::class, 'index'])->name('pos.index');
    Route::post('/pos/checkout', [POSController::class, 'checkout'])->name('pos.checkout');

    Route::get('/customers', function () {
        return app(ContactController::class)->index('customer'); // Pass 'customer' as a parameter
    })->name('customers.index');
    Route::get('/vendors', function () {
        return app(ContactController::class)->index('vendor'); // Pass 'customer' as a parameter
    })->name('vendors.index');
    Route::post('/contact', [ContactController::class, 'store'])->name('contacts.store');
    Route::post('/contact/{id}', [ContactController::class, 'update'])->name('contacts.update');

    Route::get('/sales', [SaleController::class, 'index'])->name('sales.index');
    Route::get('/reciept/{id}', [SaleController::class, 'reciept'])->name('sales.reciept');

    Route::get('/purchases', [PurchaseController::class, 'index'])->name('purchases.index');
    Route::get('/purchase/create', [PurchaseController::class, 'create'])->name('purchases.create');
    Route::post('/purchase/store', [PurchaseController::class, 'store'])->name('purchases.store');

    Route::post('/quantity/store', [QuantityController::class, 'store'])->name('quantity.store');
});

require __DIR__.'/auth.php';
