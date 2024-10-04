<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Transaction;

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

    public function checkout(Request $request){
        $amountReceived = $request->input('amount_recieved');
        $discount = $request->input('discount');
        $total = $request->input('total');
        $note = $request->input('note');
        $profitAmount = $request->input('profit_amount', 0); // Default to 0 if not provided
        $cartItems = $request->input('cartItems');
        $paymentMethod = $request->input('payment_method');

        $sale = Sale::create([
            'store_id' => 1, // Assign appropriate store ID
            'customer_id' => 1, // Assign appropriate customer ID
            'sale_date' => now(), // Current date and time
            'total_amount' => $total,
            'discount' => $discount,
            'amount_received' => $amountReceived,
            'profit_amount' => $profitAmount,
            'status' => 'completed', // Or 'pending', or other status as needed
            'note' => $note,
        ]);

        $transaction = Transaction::create([
            'sales_id' => $sale->id,
            'store_id' => 1,
            'customer_id' => 1,
            'transaction_date' => now(), // Current date and time
            'amount' => $total,
            'payment_method' => $paymentMethod,
        ]);

        foreach ($cartItems as $item) {
            SaleItem::create([
                'sale_id' => $sale->id, // Associate the sales item with the newly created sale
                'product_id' => $item['id'], // Product ID (assuming you have this)
                'batch_id' => $item['batch_id'], // Batch ID from the cart item
                'quantity' => $item['quantity'], // Quantity sold
                'unit_price' => $item['price'], // Sale price per unit
                'unit_cost' => $item['cost'], // Cost price per unit
                'discount' => $item['discount'], // Discount applied to this item
            ]);
        }



        return response()->json(['message' => 'Sale recorded successfully!', 'sale_id' => $sale->id], 201);
    }
}
