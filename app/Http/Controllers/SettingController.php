<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Setting;

class SettingController extends Controller
{
    public function index(){
        $imageUrl='';
        if (app()->environment('production')) $imageUrl='public/';

        $settings = Setting::all();
        $settingArray = $settings->pluck('meta_value', 'meta_key')->all();
        $settingArray['shop_logo'] = $imageUrl.$settingArray['shop_logo'];
         // Render the 'Settings' component with data
         return Inertia::render('Settings/Settings', [
            'settings' => $settingArray,
            'pageLabel'=>'Settings',
        ]);
    }

    public function update(Request $request){
        $request->validate([
            'sale_receipt_note' => 'required|string',
            'shop_name' => 'required|string',
            'shop_logo' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $settingsData = $request->only(['sale_receipt_note', 'shop_name', 'sale_print_padding_right','show_barcode_store','show_barcode_product_price','show_barcode_product_name']);

        $settingsData['show_barcode_store'] = $request->has('show_barcode_store') ? 'on' : 'off';
        $settingsData['show_barcode_product_price'] = $request->has('show_barcode_product_price') ? 'on' : 'off';
        $settingsData['show_barcode_product_name'] = $request->has('show_barcode_product_name') ? 'on' : 'off';

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
                ['meta_value' => 'storage/'.$imageUrl]
            );
        }

        return redirect()->route('settings.index')->with('success', 'Setting is updated successfully!');
    }
}
