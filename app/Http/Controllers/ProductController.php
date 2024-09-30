<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Collection;
use App\Models\Product;

class ProductController extends Controller
{
    public function index()
    {
        // $user = Auth::user();
        $products = Product::select('id','image_url', 'name', 'barcode', 'quantity', 'created_at', 'updated_at')->get();
         // Render the 'Dashboard' component with data
        return Inertia::render('Product/Product', [
            'products' => $products,
            'urlImage' =>url('storage/'),
        ]);
    }

    public function create()
    {
        $collection = Collection::select('id', 'name', 'collection_type')->get();
        // Render the 'Product/ProductForm' component for adding a new product
        return Inertia::render('Product/ProductForm', [
            'collection' => $collection, // Example if you have categories
        ]);
    }

    public function find($id)
    {
        $collection = Collection::select('id', 'name', 'collection_type')->get();
        $product = Product::findOrFail($id);
        // Render the 'Product/ProductForm' component for adding a new product
        return Inertia::render('Product/ProductForm', [
            'collection' => $collection, // Example if you have categories
            'product'=>$product,
        ]);
    }

    public function store(Request $request){

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sku' => 'nullable|string|unique:products',
            'barcode' => 'nullable|string',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10000', // Image validation
            'unit' => 'nullable|string|max:100',
            'quantity' => 'required|numeric|min:0',
            'alert_quantity' => 'nullable|numeric|min:0',
            'is_stock_managed' => 'boolean',
            'is_active' => 'boolean',
            'brand_id' => 'nullable|exists:brands,id', // Assuming brands table exists
            'category_id' => 'nullable|exists:categories,id', // Assuming categories table exists
        ]);

        $imageUrl = null;
        if ($request->hasFile('featured_image')) {
            $folderPath = 'uploads/' . date('Y') . '/' . date('m') . '/';
            $imageUrl = $request->file('featured_image')->store($folderPath, 'public'); // Store the image in the public disk
        }

        // Product::create([
        //     'name' => $request->name,
        //     'description' => $request->description,
        //     'sku' => $request->sku,
        //     'barcode' => $request->barcode,
        //     'image_url' => $imageUrl, // Save the image path
        //     'unit' => $request->unit,
        //     'quantity' => $request->quantity,
        //     // 'alert_quantity' => $request->alert_quantity,
        //     'alert_quantity' => 5,
        //     'is_stock_managed' => $request->is_stock_managed,
        //     'is_active' => 1,
        //     'brand_id' => $request->brand_id,
        //     'category_id' => $request->category_id,
        // ]);

    }
}
