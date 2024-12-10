<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Http\Request;
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
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ReloadController;
use App\Http\Controllers\UpgradeController;

Route::get('/', function () {
    return redirect('login');
    // return Inertia::render('Welcome', [
    //     'canLogin' => Route::has('login'),
    //     'canRegister' => Route::has('register'),
    // ]);
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/dashboard/summary', [DashboardController::class, 'getDashboardSummary'])->name('dashboard.summary');
    
    Route::get('/stores', [StoreController::class, 'index'])->name('store');
    Route::post('/store', [StoreController::class, 'store']);
    Route::post('/store/{id}', [StoreController::class, 'update']);
    Route::post('/change-store', [StoreController::class, 'changeSelectedStore'])->name('change.store');

    Route::get('/collections', [CollectionController::class, 'index'])->name('collection');
    Route::post('/collection', [CollectionController::class, 'store']);
    Route::post('/collection/{id}', [CollectionController::class, 'update']);

    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
    Route::get('/products/{id}/edit', [ProductController::class, 'find'])->name('products.find');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::post('/products/{id}', [ProductController::class, 'update'])->name('products.update');
    Route::get('/products/search', [ProductController::class, 'searchProduct'])->name('products.search');
    Route::post('/storebatch', [ProductController::class, 'storeNewBatch'])->name('products.newbatch');
    Route::post('/checkBatch', [ProductController::class, 'checkBatch'])->name('products.checkbatch');
    Route::post('/productbatch/{id}', [ProductController::class, 'updateBatch'])->name('products.updatebatch');
    Route::get('/getproducts/{store_id}', [ProductController::class, 'getProductsResponse'])->name('products.getproducts');
    Route::get('/product/{batch_id}/barcode', [ProductController::class, 'getBarcode'])->name('products.barcode');

    Route::get('/pos', [POSController::class, 'index'])->name('pos.index');
    Route::get('/pos/{sale_id}/return', [POSController::class, 'returnIndex'])->name('pos.return');
    Route::post('/pos/checkout', [POSController::class, 'checkout'])->name('pos.checkout');
    Route::get('/pos/customer-display', [POSController::class, 'customerDisplay']);

    Route::get('/customers', [ContactController::class, 'index'])->defaults('type', 'customer')->name('customers.index');
    Route::get('/vendors', [ContactController::class, 'index'])->defaults('type', 'vendor')->name('vendors.index');
    Route::post('/contact', [ContactController::class, 'store'])->name('contacts.store');
    Route::post('/contact/{id}', [ContactController::class, 'update'])->name('contacts.update');

    Route::get('/sales', [SaleController::class, 'index'])->name('sales.index');
    Route::get('/reciept/{id}', [SaleController::class, 'reciept'])->name('sales.reciept');
    Route::get('/sold-items', [SaleController::class, 'solditems'])->name('sales.items');

    Route::get('/purchases', [PurchaseController::class, 'index'])->name('purchases.index');
    Route::get('/purchase/create', [PurchaseController::class, 'create'])->name('purchases.create');
    Route::post('/purchase/store', [PurchaseController::class, 'store'])->name('purchases.store');

    Route::post('/quantity/store', [QuantityController::class, 'store'])->name('quantity.store');

    Route::post('/customer-transaction', [TransactionController::class, 'storeCustomerTransaction']);
    Route::post('/vendor-transaction', [TransactionController::class, 'storeVendorTransaction']);
    Route::get('/payments/{type}', [TransactionController::class, 'viewPayments']); //It will be purchases or sales

    Route::post('/getpayments/{type}', [TransactionController::class, 'findPayments']); //It will be purchases or sales
    Route::post('/delete-payment/{type}', [TransactionController::class, 'deletePayment']);
    Route::post('/getorderdetails/{type}', [ReportController::class, 'viewOrderDetails']); //It will be purchases or sales

    Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');
    Route::get('/settings/quote-template', [SettingController::class, 'quoteTemplate']);
    Route::get('/settings/receipt-template', [SettingController::class, 'receiptTemplate']);
    Route::get('/settings/barcode-template', [SettingController::class, 'barcodeTemplate']);
    Route::post('/settings/save-template', [SettingController::class, 'updateTemplate']);
    Route::get('/settings/custom-css', [SettingController::class, 'customCSS']);
    Route::post('/settings/custom-css', [SettingController::class, 'updateCustomCSS']);

    Route::get('/expenses',[ExpenseController::class, 'index'])->name('expenses.index');
    Route::post('/expense',[ExpenseController::class, 'store'])->name('expenses.store');
    Route::post('/expense/{id}/delete',[ExpenseController::class, 'delete'])->name('expenses.delete');

    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/user', [UserController::class, 'store'])->name('user.store');
    Route::get('/user/role', [UserController::class, 'userRole'])->name('user.role');
    Route::post('/user/role', [UserController::class, 'storeRole'])->name('user.storeRole');
    Route::post('/user/{roleId}/role', [UserController::class, 'updateRole'])->name('user.updateRole');
    Route::post('/user/{id}', [UserController::class, 'update'])->name('user.update');

    // Route::get('reports/daily',[ReportController::class, 'getDailyReport'])->name('reports.daily');
    Route::get('reports/dailycash',[ReportController::class, 'getDailyCashReport'])->name('reports.dailycash');
    Route::post('reports/dailycash',[ReportController::class, 'storeDailyCashReport'])->name('reports.store.dailycash');
    Route::get('reports/sales',[ReportController::class, 'getSalesReport'])->name('reports.sales');
    Route::get('reports/{customer}/customer-pending',[ReportController::class, 'getCustomerPendingReport']);
    Route::get('reports/{vendor}/vendor-pending',[ReportController::class, 'getVendorPendingReport']);
    Route::get('reports/{id}/customer',[ReportController::class, 'getCustomerReport'])->name('reports.customer');
    Route::get('reports/{id}/vendor',[ReportController::class, 'getVendorReport'])->name('reports.vendor');

    Route::get('/reloads',[ReloadController::class, 'index']);

    Route::get('/link-storage', function () {
        Artisan::call('storage:link');
        return 'Linked with storage';
    });

    Route::get('/upload', [UpgradeController::class, 'showUploadForm'])->name('upload.form');
    Route::post('/upload', [UpgradeController::class, 'handleUpload'])->name('upload.handle');

    Route::get('/clear', function () {
        Artisan::call('config:cache');
        Artisan::call('route:cache');
        Artisan::call('view:clear');
        return 'Update completed!';
    });

    Route::get('/check-update', function(){
        return 'Update';
    });
});

require __DIR__.'/auth.php';
