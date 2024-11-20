<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ReloadAndBillMeta;
use App\Models\Store;
use Inertia\Inertia;

class ReloadController extends Controller
{
    public function getReloads($filters)
{
    $query = ReloadAndBillMeta::query();
    
    // Select necessary fields, including product_name via join with products table
    $query->select(
        'reload_and_bill_metas.id',
        'products.name AS product_name', // Get the product name
        'reload_and_bill_metas.transaction_type',
        'reload_and_bill_metas.account_number',
        'reload_and_bill_metas.commission',
        'reload_and_bill_metas.additional_commission',
        'sale_items.unit_price',
        'reload_and_bill_metas.description',
        'sale_items.sale_date',
    )
    ->leftJoin('sale_items', 'reload_and_bill_metas.sale_item_id', '=', 'sale_items.id') // Join with sale_items table
    ->leftJoin('products', 'sale_items.product_id', '=', 'products.id'); // Join with products table via product_id

    // Apply search query if provided
    if (!empty($filters['search_query'])) {
        $query->where(function ($query) use ($filters) {
            $query->where('reload_and_bill_metas.account_number', 'LIKE', '%' . $filters['search_query'] . '%')
                ->orWhere('products.name', 'LIKE', '%' . $filters['search_query'] . '%');
        });
    }

    // Apply filters for date range if provided
    if (!empty($filters['start_date']) && !empty($filters['end_date'])) {
        $query->whereBetween('sale_items.sale_date', [$filters['start_date'], $filters['end_date']]);
    }

    $query->orderBy('reload_and_bill_metas.id', 'desc');

    // Paginate the results
    $results = $query->paginate(100);
    $results->appends($filters);

    return $results;
}

public function index(Request $request)
    {
        $filters = $request->only(['store', 'search_query', 'status', 'start_date', 'end_date']);

        $reloads = $this->getReloads($filters);
        $stores = Store::select('id', 'name')->get();

        // return response()->json($reloads);
        //  Render the 'Products' component with data
        return Inertia::render('Reload/Reload', [
            'reloads' => $reloads,
            'stores'=>$stores,
            'pageLabel'=>'Reloads',
        ]);
    }

}
