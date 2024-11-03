<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Collection;
use App\Models\Product;
use App\Models\ProductBatch;
use App\Models\ProductStock;
use App\Models\Store;

use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function getProducts($filters){
        $imageUrl = 'storage/';
        if (app()->environment('production')) $imageUrl='public/storage/';

        $query = ProductBatch::query();
        $query->select(
            'products.id',
            'product_stocks.id as stock_id',
            'product_batches.is_featured',
            'product_batches.id AS batch_id',
            DB::raw("CONCAT('{$imageUrl}', products.image_url) AS image_url"),
            'products.name',
            'products.barcode',
            DB::raw("COALESCE(products.sku, 'N/A') AS sku"),
            DB::raw("COALESCE(product_batches.batch_number, 'N/A') AS batch_number"),
            DB::raw("COALESCE(product_batches.expiry_date, 'N/A') AS expiry_date"),
            'product_batches.cost',
            'product_batches.price',
            'product_batches.is_active',
            DB::raw("COALESCE(product_stocks.quantity, '0') AS quantity"),
            'product_stocks.store_id',
            'products.created_at',
            'products.updated_at'
        )
        ->leftJoin('products', 'products.id', '=', 'product_batches.product_id') // Join with product_batches using product_id
        ->leftJoin('product_stocks', 'product_batches.id', '=', 'product_stocks.batch_id'); // Join with product_stocks using batch_id

        // Apply filters based on the status
        if (isset($filters['status']) && $filters['status'] == 1) {
            // If status is 1, filter by store_id and status
            $query->where('product_batches.is_active', 1); // Assuming 1 means active
            if ($filters['store'] != 0) {
                $query->where('product_stocks.store_id', $filters['store']);
            }
        } else if(isset($filters['status'])) {
            // If status is not 1, only filter by status
            $query->where('product_batches.is_active', $filters['status']);
        }
        else $query->where('product_batches.is_active', 1);

        // Apply search query if provided
        if (!empty($filters['search_query'])) {
            $query->where(function ($query) use ($filters) {
                $query->where('products.barcode', 'LIKE', '%' . $filters['search_query'] . '%')
                    ->orWhere('products.name', 'LIKE', '%' . $filters['search_query'] . '%');
            });
        }

        $results = $query->paginate(25);
        $results->appends($filters);
        return $results;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['store', 'search_query', 'status']);

        $products = $this->getProducts($filters);
        $stores = Store::select('id', 'name')->get();

         // Render the 'Products' component with data
        return Inertia::render('Product/Product', [
            'products' => $products,
            'stores'=>$stores,
            'pageLabel'=>'Products',
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
            'cost' => 'required|numeric|min:0', // Cost price validation
            'price' => 'required|numeric|min:0', // Sale price validation
            'is_stock_managed' => 'boolean',
            'is_active' => 'boolean',
            'brand_id' => 'nullable|exists:collections,id', // Assuming brands table exists
            'category_id' => 'nullable|exists:collections,id', // Assuming categories table exists
        ]);

        $imageUrl = null;
        if ($request->hasFile('featured_image')) {
            $folderPath = 'uploads/' . date('Y') . '/' . date('m') . '/';
            $imageUrl = $request->file('featured_image')->store($folderPath, 'public'); // Store the image in the public disk
        }

        $product=Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'sku' => $request->sku,
            'barcode' => $request->barcode,
            'image_url' => $imageUrl, // Save the image path
            'unit' => $request->unit,
            'quantity' => $request->quantity,
            'alert_quantity' => $request->alert_quantity ?? 5,
            'is_stock_managed' => $request->is_stock_managed,
            'is_active' => 1,
            'brand_id' => $request->brand_id,
            'category_id' => $request->category_id,
        ]);

        $productBatch = ProductBatch::create([
            'product_id' => $product->id,
            'batch_number' => $request->batch_number ?: 'DEFAULT',
            'expiry_date' => $request->expiry_date,
            'cost' => $request->cost,
            'price' => $request->price,
        ]);

        ProductStock::create([
            'store_id' => 1,
            'batch_id' => $productBatch->id, // Use the batch ID from the created ProductBatch
            'quantity' => $request->quantity,
        ]);

        return redirect()->route('products.index')->with('success', 'Product created successfully!');
    }

    public function update(Request $request, $id)
    {
        // Validate the incoming request
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sku' => 'nullable|string|unique:products,sku,' . $id, // Ensure SKU is unique except for the current product
            'barcode' => 'nullable|string',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10000', // Image validation
            'unit' => 'nullable|string|max:100',
            'alert_quantity' => 'nullable|numeric|min:0',
            'is_stock_managed' => 'boolean',
            'is_active' => 'boolean',
            'brand_id' => 'nullable|exists:collections,id',
            'category_id' => 'nullable|exists:collections,id',
        ]);

        // Find the product by ID, or fail if it doesn't exist
        $product = Product::findOrFail($id);

        // Handle the image upload
        $imageUrl = $product->image_url; // Retain the current image URL
        if ($request->hasFile('featured_image')) {
            $folderPath = 'uploads/' . date('Y') . '/' . date('m') . '/';
            $imageUrl = $request->file('featured_image')->store($folderPath, 'public'); // Store new image and replace the old one
        }

        // Update the product with new values
        $product->update([
            'name' => $request->name,
            'description' => $request->description,
            'sku' => $request->sku,
            'barcode' => $request->barcode,
            'image_url' => $imageUrl, // Update the image URL if a new image was uploaded
            'unit' => $request->unit,
            'alert_quantity' => $request->alert_quantity ?? 5, // Use default alert_quantity if null
            'is_stock_managed' => $request->is_stock_managed,
            'is_active' => $request->is_active ?? 1, // Default to active if not provided
            'brand_id' => $request->brand_id,
            'category_id' => $request->category_id,
        ]);

        // Return a response, or redirect to a specific page
        return redirect()->route('products.index')->with('success', 'Product updated successfully!');
    }

    public function searchProduct(Request $request){
        $imageUrl = 'storage/';
        if (app()->environment('production')) $imageUrl='public/storage/';

        $search_query = $request->input('search_query');
        $is_purchase = $request->input('is_purchase',0);

        $products = Product::select(
            'products.id',
            DB::raw("CONCAT('{$imageUrl}', products.image_url) AS image_url"),
            'products.name',
            'products.barcode',
            DB::raw("COALESCE(products.sku, 'N/A') AS sku"),
            'products.discount',
            'products.is_stock_managed',
            DB::raw("COALESCE(product_batches.batch_number, 'N/A') AS batch_number"),
            'product_batches.cost',
            'product_batches.price',
            'product_batches.id AS batch_id',
            'product_stocks.quantity', // Only keeping the summed quantity from product_stocks
        )
        ->leftJoin('product_batches', 'products.id', '=', 'product_batches.product_id') // Join with product_batches using product_id
        ->leftJoin('product_stocks', 'product_batches.id', '=', 'product_stocks.batch_id') // Join with product_stocks using batch_id
        ->where('barcode', 'like', '%' . $search_query . '%')
        ->orWhere('sku', 'like', '%' . $search_query . '%')
        ->orWhere('name', 'like', '%' . $search_query . '%');

        if($is_purchase==0){
            $products = $products->where('product_stocks.store_id', session('store_id'));
        }
        else{
            $products = $products->whereNotNull('product_stocks.store_id');
        }
      
        $products = $products
        ->groupBy(
        'products.id',
        'product_batches.id', 
        'product_batches.batch_number', 
        'product_stocks.quantity',
        'products.image_url',
        'products.name',
        'products.discount',
        'products.is_stock_managed',
        'product_batches.cost',
        'product_batches.price',
        'products.barcode',
        'products.sku',
        )
        ->limit(10)->get();
        
        return response()->json([
            'products' => $products,
        ]);
    }

    public function storeNewBatch(Request $request){
        // Validate the incoming request data
        $validatedData = $request->validate([
            'id' => 'required|exists:products,id', // Ensure product_id exists in products table
            'new_batch' => 'required|string|max:255',
            'cost' => 'required|numeric|min:0',
            'price' => 'required|numeric|min:0',
        ]);

        $batch = ProductBatch::create([
            'product_id' => $validatedData['id'], // Map 'id' to 'product_id'
            'batch_number' => $validatedData['new_batch'], // Map 'new_batch' to 'batch_number'
            'cost' => $validatedData['cost'],
            'price' => $validatedData['price'],
        ]);

        return response()->json([
            'message'=>'Batch is created',
            'batch_id' => $batch->id,
        ]);
    }

    public function updateBatch(Request $request, $id){
        $validatedData = $request->validate([
            'batch_number' => 'required|string|max:255',
            'cost' => 'required|numeric|min:0',
            'price' => 'required|numeric|min:0',
        ]);

        $batch = ProductBatch::findOrFail($id);
        $batch->update([
            'batch_number' => $validatedData['batch_number'], // Map 'new_batch' to 'batch_number'
            'cost' => $validatedData['cost'],
            'price' => $validatedData['price'],
            'expiry_date'=>$request->expiry_date,
            'is_active'=>$request->is_active ?? 0,
            'is_featured'=>$request->is_featured ?? 0,
        ]);

        return response()->json([
            'message' => 'Batch updated successfully!',
            'batch'=>$batch,
        ], 200);
    }

    public function getProductsResponse($store_id){
        $products = $this->getProducts($store_id);
        return response()->json([
            'products'=>$products,
        ], 200);
    }

    public function getBarcode($batch_id)
    {
        $product = ProductBatch::select('products.name', 'products.barcode', 'product_batches.price')
        ->join('products', 'product_batches.product_id', '=', 'products.id')
        ->where('product_batches.id', $batch_id)
        ->first();

         // Render the 'Products' component with data
        return Inertia::render('Product/Barcode', [
            'product' => $product,
        ]);
    }

}
