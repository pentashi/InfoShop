<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Transaction;
use App\Models\Contact;
use App\Models\ProductStock;
use App\Models\Product;

use Illuminate\Support\Facades\DB;

class POSController extends Controller
{
    public function index()
    {
        $contacts = Contact::select('id', 'name','balance')->customers()->get();

        $products = DB::table('Products AS p')
        ->select(
            'p.id',
            'p.image_url',
            'p.name',
            'p.discount',
            'p.is_stock_managed',
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
            'customers'=>$contacts,
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
        $customerID = $request->input('customer_id');

        $sale = Sale::create([
            'store_id' => 1, // Assign appropriate store ID
            'customer_id' => $customerID, // Assign appropriate customer ID
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
            'customer_id' => $customerID,
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
    
            if($item['is_stock_managed'] ==1){
                $productStock = ProductStock::where('store_id', $sale->store_id) // Assuming you have store_id from $sale or $item
                                    ->where('batch_id', $item['batch_id'])
                                    ->first();

                // Check if stock exists
                if ($productStock) {
                    // Deduct the quantity from the stock
                    $productStock->quantity -= $item['quantity'];

                    // Ensure that stock doesn't go negative
                    if ($productStock->quantity < 0) {
                        $productStock->quantity = 0;
                    }

                    // Save the updated stock quantity
                    $productStock->save();
                } else {
                    // Handle case if stock does not exist (optional)
                    // e.g., throw an exception or log an error
                    throw new \Exception('Stock for product not found in the specified store or batch');
                }
            }
        }

        return response()->json(['message' => 'Sale recorded successfully!', 'sale_id' => $sale->id], 201);
    }
}
