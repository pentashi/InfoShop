<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Setting;
use Illuminate\Support\Facades\File;

class SettingController extends Controller
{
    public function index()
    {
        $imageUrl = '';
        if (app()->environment('production')) $imageUrl = 'public/';

        $settings = Setting::all();
        $settingArray = $settings->pluck('meta_value', 'meta_key')->all();
        $settingArray['shop_logo'] = $imageUrl . $settingArray['shop_logo'];
        // Render the 'Settings' component with data
        return Inertia::render('Settings/Settings', [
            'settings' => $settingArray,
            'pageLabel' => 'Settings',
        ]);
    }

    public function quoteTemplate()
    {
        $imageUrl='';
        if (app()->environment('production')) $imageUrl='public/';
        $id=2;

        $settings = Setting::all();
        $settingArray = $settings->pluck('meta_value', 'meta_key')->all();
        $settingArray['shop_logo'] = $imageUrl.$settingArray['shop_logo'];
        $sale = \App\Models\Sale::select(
            'sales.id',
            'contact_id',            // Customer ID
            'sale_date',              // Sale date
            'total_amount',           // Total amount (Total amount after discount [net_total - discount])
            'discount',                // Discount
            'amount_received',         // Amount received
            'profit_amount',          // Profit amount
            'status',                  // Sale status
            'stores.address',
            'contacts.name', // Customer name from contacts
            'sales.created_by',
            'invoice_number',
            'stores.sale_prefix',
            'stores.contact_number',
            'sales.created_at'
        )
        ->leftJoin('contacts', 'sales.contact_id', '=', 'contacts.id') // Join with contacts table using customer_id
        ->join('stores', 'sales.store_id','=','stores.id')
        ->where('sales.id',$id)
        ->first();

        $user = \App\Models\User::find($sale->created_by);

        $salesItems = \App\Models\SaleItem::select(
            'sale_items.quantity',
            'sale_items.unit_price',
            'sale_items.discount',
            'products.name',
        )
        ->leftJoin('products', 'sale_items.product_id', '=', 'products.id') // Join with contacts table using customer_id
        ->where('sale_items.sale_id',$id)
        ->get();

        $templateName = 'quote-template.html'; // or get this from the request
        $templatePath = storage_path("app/public/templates/{$templateName}");
        $content = File::exists($templatePath) ? File::get($templatePath) : '';

        // $templatePath = resource_path('views/templates/quote-template.html');
        // $content = File::exists($templatePath) ? File::get($templatePath) : '';

        return Inertia::render('Settings/QuoteTemplate', [
            'pageLabel' => 'Quote Template',
            'template' => $content,
            'sale'=>$sale,
            'salesItems'=>$salesItems,
            'settings'=>$settingArray,
            'user_name'=>$user->name,
            'template_name'=>$templateName,
        ]);
    }

    public function receiptTemplate()
    {
        $imageUrl='';
        if (app()->environment('production')) $imageUrl='public/';
        $id=2;

        $settings = Setting::all();
        $settingArray = $settings->pluck('meta_value', 'meta_key')->all();
        $settingArray['shop_logo'] = $imageUrl.$settingArray['shop_logo'];
        $sale = \App\Models\Sale::select(
            'sales.id',
            'contact_id',            // Customer ID
            'sale_date',              // Sale date
            'total_amount',           // Total amount (Total amount after discount [net_total - discount])
            'discount',                // Discount
            'amount_received',         // Amount received
            'profit_amount',          // Profit amount
            'status',                  // Sale status
            'stores.address',
            'contacts.name', // Customer name from contacts
            'sales.created_by',
            'invoice_number',
            'stores.sale_prefix',
            'stores.contact_number',
            'sales.created_at'
        )
        ->leftJoin('contacts', 'sales.contact_id', '=', 'contacts.id') // Join with contacts table using customer_id
        ->join('stores', 'sales.store_id','=','stores.id')
        ->where('sales.id',$id)
        ->first();

        $user = \App\Models\User::find($sale->created_by);

        $salesItems = \App\Models\SaleItem::select(
            'sale_items.quantity',
            'sale_items.unit_price',
            'sale_items.discount',
            'products.name',
        )
        ->leftJoin('products', 'sale_items.product_id', '=', 'products.id') // Join with contacts table using customer_id
        ->where('sale_items.sale_id',$id)
        ->get();

        $templateName = 'receipt-template.html'; // or get this from the request
        $templatePath = storage_path("app/public/templates/{$templateName}");
        $content = File::exists($templatePath) ? File::get($templatePath) : '';

        // $templatePath = resource_path('views/templates/quote-template.html');
        // $content = File::exists($templatePath) ? File::get($templatePath) : '';

        return Inertia::render('Settings/QuoteTemplate', [
            'pageLabel' => 'Receipt Template',
            'template' => $content,
            'sale'=>$sale,
            'salesItems'=>$salesItems,
            'settings'=>$settingArray,
            'user_name'=>$user->name,
            'template_name'=>$templateName,
        ]);
    }

    public function barcodeTemplate()
    {
        $imageUrl='';
        if (app()->environment('production')) $imageUrl='public/';

        $settings = Setting::whereIn('meta_key', [
            'show_barcode_store',
            'show_barcode_product_price',
            'show_barcode_product_name',
            'barcode_settings',
            'shop_logo',
        ])->get();
        $settingArray = $settings->pluck('meta_value', 'meta_key')->all();
        $settingArray['shop_logo'] = $imageUrl.$settingArray['shop_logo'];

        $templateName = 'barcode-template.html'; // or get this from the request
        $templatePath = storage_path("app/public/templates/{$templateName}");
        $content = File::exists($templatePath) ? File::get($templatePath) : '';

        $product = [
            'name' => 'ABC Product - XML',       // Product name
            'barcode' => '8718719850268',    // Product barcode
            'price' => 1000           // Price from the product batch
        ];

        // $templatePath = resource_path('views/templates/quote-template.html');
        // $content = File::exists($templatePath) ? File::get($templatePath) : '';

        return Inertia::render('Settings/BarcodeTemplate', [
            'pageLabel' => 'Barcode Template',
            'template' => $content,
            'barcode_settings'=>$settingArray,
            'product' => $product,
            'template_name'=>$templateName,
        ]);
    }

    public function updateTemplate(Request $request)
    {
        $validated = $request->validate([
            'template' => 'required|string',
            'template_name'=>'required'
        ]);

        //$templateName = 'quote-template.html'; // or get this from the request
        $templateName = $request->template_name;
        $templatePath = storage_path("app/public/templates/{$templateName}");
        // $templatePath = storage_path('views/templates/quote-template.html');
        File::put($templatePath, $validated['template']);

        return response()->json(['message' => 'Template updated successfully!'],200);
    }

    public function update(Request $request)
    {
        $request->validate([
            'sale_receipt_note' => 'required|string',
            'shop_name' => 'required|string',
            'shop_logo' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $settingsData = $request->only(['sale_receipt_note', 'shop_name', 'sale_print_padding_right', 'sale_print_padding_left', 'sale_print_font', 'show_barcode_store', 'show_barcode_product_price', 'show_barcode_product_name','show_receipt_shop_name']);

        $settingsData['show_barcode_store'] = $request->has('show_barcode_store') ? 'on' : 'off';
        $settingsData['show_barcode_product_price'] = $request->has('show_barcode_product_price') ? 'on' : 'off';
        $settingsData['show_barcode_product_name'] = $request->has('show_barcode_product_name') ? 'on' : 'off';

        // Add barcode settings JSON string to settingsData if it exists
        if ($request->has('barcodeSettings')) {
            $settingsData['barcode_settings'] = $request->input('barcodeSettings');
        }

        foreach ($settingsData as $metaKey => $metaValue) {
            if ($metaValue !== null) { // Ensure the value is not null before updating
                Setting::updateOrCreate(
                    ['meta_key' => $metaKey],
                    ['meta_value' => $metaValue]
                );
            }
        }

        // Handle image upload if a file is present
        if ($request->hasFile('shop_logo')) {
            $image = $request->file('shop_logo');

            $folderPath = 'uploads/' . date('Y') . '/' . date('m');
            $imageUrl = $image->store($folderPath, 'public');

            // Update the 'shop_logo' setting in the database with the image path
            Setting::updateOrCreate(
                ['meta_key' => 'shop_logo'],
                ['meta_value' => 'storage/' . $imageUrl]
            );
        }

        return redirect()->route('settings.index')->with('success', 'Setting is updated successfully!');
    }
}
