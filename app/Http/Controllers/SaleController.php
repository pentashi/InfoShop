<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Sale;
use App\Models\Setting;

use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    public function index()
    {
        $sales = DB::table('Sales AS s')
        ->select(
            's.id',
            's.contact_id',            // Customer ID
            's.sale_date',              // Sale date
            's.total_amount',           // Total amount (Total amount after discount [net_total - discount])
            's.discount',                // Discount
            's.amount_received',         // Amount received
            's.profit_amount',          // Profit amount
            's.status',                  // Sale status
            'c.name', // Customer name from contacts
            's.store_id',
        )
        ->leftJoin('contacts AS c', 's.contact_id', '=', 'c.id') // Join with contacts table using customer_id
        ->orderBy('s.id', 'desc')
        ->get();

        return Inertia::render('Sale/Sale', [
            'sales' => $sales,
        ]);
    }

    public function reciept($id){
        $settings = Setting::all();
        $settingArray = $settings->pluck('meta_value', 'meta_key')->all();
        $sale = DB::table('Sales AS s')
        ->select(
            's.id',
            's.contact_id',            // Customer ID
            's.sale_date',              // Sale date
            's.total_amount',           // Total amount (Total amount after discount [net_total - discount])
            's.discount',                // Discount
            's.amount_received',         // Amount received
            's.profit_amount',          // Profit amount
            's.status',                  // Sale status
            'stores.address',
            'c.name', // Customer name from contacts
        )
        ->leftJoin('contacts AS c', 's.contact_id', '=', 'c.id') // Join with contacts table using customer_id
        ->join('stores', 's.store_id','=','stores.id')
        ->where('s.id','=',$id)
        ->get();

        $salesItems = DB::table('sale_items AS si')
        ->select(
            'si.quantity',
            'si.unit_price',
            'p.name',
        )
        ->leftJoin('products AS p', 'si.product_id', '=', 'p.id') // Join with contacts table using customer_id
        ->where('si.id','=',$id)
        ->get();
        
        return Inertia::render('Sale/Reciept',[
            'sale'=>$sale,
            'salesItems'=>$salesItems,
            'settings'=>$settingArray,
        ]);
    }
}
