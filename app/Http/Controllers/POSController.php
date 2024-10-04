<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Support\Facades\DB;

class POSController extends Controller
{
    public function index()
    {
        // $products = Product::select('id','image_url', 'name', 'barcode', 'quantity', 'created_at', 'updated_at')->get();
        $products = DB::table('Products AS p')
        ->select(
            'p.id',
            'p.image_url',
            'p.name',
            'p.discount',
            DB::raw("COALESCE(pb.batch_number, 'N/A') AS batch_number"),
            'pb.cost',
            'pb.price',
            'pb.id AS batch_id',
            'ps.quantity', // Only keeping the summed quantity from product_stocks
        )
        ->leftJoin('product_batches AS pb', 'p.id', '=', 'pb.product_id') // Join with product_batches using product_id
        ->leftJoin('product_stocks AS ps', 'pb.id', '=', 'ps.batch_id') // Join with product_stocks using batch_id
        ->where('ps.store_id', 1) //Get store ID from session.
        ->get();
   
        return Inertia::render('POS/POS', [
            'products' => $products,
            'urlImage' =>url('storage/'),
        ]);
    }

    public function searchProduct(Request $request){
        $search_query = $request->input('search_query');
        $barcodeChecked = filter_var($request->input('barcodeChecked'), FILTER_VALIDATE_BOOLEAN);


        $products = DB::table('Products AS p')
        ->select(
            'p.id',
            'p.image_url',
            'p.name',
            'p.discount',
            DB::raw("COALESCE(pb.batch_number, 'N/A') AS batch_number"),
            'pb.cost',
            'pb.price',
            'pb.id AS batch_id',
            'ps.quantity', // Only keeping the summed quantity from product_stocks
        )
        ->leftJoin('product_batches AS pb', 'p.id', '=', 'pb.product_id') // Join with product_batches using product_id
        ->leftJoin('product_stocks AS ps', 'pb.id', '=', 'ps.batch_id') // Join with product_stocks using batch_id
        ->where('ps.store_id', 1);

        if ($barcodeChecked) {
            $products = $products->where('p.barcode', 'like', "%$search_query%"); // Assuming 'barcode' is the field name
        } else {
            $products = $products->where('p.name', 'like', "%$search_query%"); // Search by product name
        }
        \Log::info('Generated SQL:', [
            'query' => $products->toSql(),
            'bindings' => $products->getBindings()
        ]);
        $products = $products->limit(5)->get();
        
        return response()->json([
            'products' => $products,
        ]);
    }
}
