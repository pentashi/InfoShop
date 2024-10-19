<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Setting;
use App\Models\Contact;
use App\Models\User;


class SaleController extends Controller
{
    public function getSales($filters){
        $query = Sale::query();
        $query->select(
            'sales.id',
            'contact_id',            // Customer ID
            'sale_date',              // Sale date
            'total_amount',           // Total amount (Total amount after discount [net_total - discount])
            'discount',                // Discount
            'amount_received',         // Amount received
            'profit_amount',          // Profit amount
            'status',                  // Sale status
            'contacts.name', // Customer name from contacts
            'store_id',
        )
        ->leftJoin('contacts', 'sales.contact_id', '=', 'contacts.id')
        ->orderBy('sale_date', 'desc');

        if(isset($filters['contact_id'])){
            $query->where('contact_id', $filters['contact_id']);
        }

        if(isset($filters['status']) && $filters['status'] !== 'all'){
            $query->where('status', $filters['status']);
        }

        if(isset($filters['start_date']) && isset($filters['end_date'])){
            $query->whereBetween('sale_date', [$filters['start_date'], $filters['end_date']]);
        }
        $results = $query->paginate(25);
        $results->appends($filters);
        return $results;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['contact_id', 'start_date', 'end_date', 'status']);
        $sales = $this->getSales($filters);
        $contacts = Contact::select('id', 'name','balance')->customers()->get();

        return Inertia::render('Sale/Sale', [
            'sales' => $sales,
            'contacts'=>$contacts,
            'pageLabel'=>'Sales',
        ]);
    }

    public function reciept($id){
        $settings = Setting::all();
        $settingArray = $settings->pluck('meta_value', 'meta_key')->all();
        $sale = Sale::select(
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
            'created_by',
        )
        ->leftJoin('contacts', 'sales.contact_id', '=', 'contacts.id') // Join with contacts table using customer_id
        ->join('stores', 'sales.store_id','=','stores.id')
        ->where('sales.id',$id)
        ->first();

        $user = User::find($sale->created_by);

        $salesItems = SaleItem::select(
            'sale_items.quantity',
            'sale_items.unit_price',
            'products.name',
        )
        ->leftJoin('products', 'sale_items.product_id', '=', 'products.id') // Join with contacts table using customer_id
        ->where('sale_items.sale_id',$id)
        ->get();
        
        return Inertia::render('Sale/Reciept',[
            'sale'=>$sale,
            'salesItems'=>$salesItems,
            'settings'=>$settingArray,
            'user_name'=>$user->name,
        ]);
    }
}
