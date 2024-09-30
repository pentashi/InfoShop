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
            'p.barcode',
            DB::raw("COALESCE(pb.batch_number, 'N/A') AS batch_number"),
            DB::raw("COALESCE(pb.expiry_date, 'N/A') AS expiry_date"),
            'pb.cost',
            'pb.price',
            DB::raw("SUM(ps.quantity) AS total_quantity"), // Only keeping the summed quantity from product_stocks
            'p.created_at',
            'p.updated_at'
        )
        ->leftJoin('product_batches AS pb', 'p.id', '=', 'pb.product_id') // Join with product_batches using product_id
        ->leftJoin('product_stocks AS ps', 'pb.id', '=', 'ps.batch_id') // Join with product_stocks using batch_id
        ->groupBy('p.id','pb.id') // Group by the selected fields
        ->get();
   
        return Inertia::render('POS/POS', [
            'products' => $products,
            'urlImage' =>url('storage/'),
        ]);
    }
}
