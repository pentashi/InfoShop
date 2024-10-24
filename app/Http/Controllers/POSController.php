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
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class POSController extends Controller
{
    public function index()
    {
        $imageUrl = 'storage/';
        if (app()->environment('production')) $imageUrl='public/storage/';

        $contacts = Contact::select('id', 'name','balance')->customers()->get();

        $products = Product::select(
            'products.id',
            DB::raw("CONCAT('{$imageUrl}', products.image_url) AS image_url"),
            'products.name',
            'products.discount',
            'products.is_stock_managed',
            DB::raw("COALESCE(pb.batch_number, 'N/A') AS batch_number"),
            'pb.cost',
            'pb.price',
            'pb.id AS batch_id',
            'ps.quantity',
        )
        ->leftJoin('product_batches AS pb', 'products.id', '=', 'pb.product_id') // Join with product_batches using product_id
        ->leftJoin('product_stocks AS ps', 'pb.id', '=', 'ps.batch_id') // Join with product_stocks using batch_id
        ->where('ps.store_id', 1) //Get store ID from session.
        ->where('pb.is_featured',1)
        ->groupBy(
            'products.id',
            'products.image_url', // Added this
            'products.name',      // Added this
            'products.discount',  // Added this
            'products.is_stock_managed', // Added this
            DB::raw("COALESCE(pb.batch_number, 'N/A')"), // Ensure this is matched as well
            'pb.cost', 
            'pb.price', 
            'pb.id', 
            'ps.quantity'
            )
        ->limit(20)
        ->get();
   
        return Inertia::render('POS/POS', [
            'products' => $products,
            'urlImage' =>url('storage/'),
            'customers'=>$contacts,
        ]);
    }

    public function checkout(Request $request){
        $amountReceived = $request->input('amount_recieved',0);
        $discount = $request->input('discount');
        $total = $request->input('net_total');
        $note = $request->input('note');
        $profitAmount = $request->input('profit_amount', 0); // Default to 0 if not provided
        $cartItems = $request->input('cartItems');
        $paymentMethod = $request->input('payment_method', 'none');
        $customerID = $request->input('contact_id');
        $saleDate = $request->input('sale_date');
        $payments = $request->payments;
        $createdBy = Auth::id();

        DB::beginTransaction();
        try{
            $sale = Sale::create([
                'store_id' => 1, // Assign appropriate store ID
                'contact_id' => $customerID, // Assign appropriate customer ID
                'sale_date' => $saleDate, // Current date and time
                'total_amount' => $total, //Net total (total after discount)
                'discount' => $discount,
                'amount_received' => $amountReceived,
                'profit_amount' => $profitAmount,
                'status' => 'pending', // Or 'pending', or other status as needed
                'note' => $note,
                'created_by'=>$createdBy,
            ]);

            if($paymentMethod=='Cash'){
                Transaction::create([
                    'sales_id' => $sale->id,
                    'store_id' => $sale->store_id,
                    'contact_id' => $sale->contact_id,
                    'transaction_date' => $sale->sale_date, // Current date and time
                    'amount' => $total,
                    'payment_method' => $paymentMethod,
                    'transaction_type'=>'sale'
                ]);
                $sale->status = 'completed';
                $sale->save();
            }
            else{
                foreach ($payments as $payment) {

                    $transactionData = [
                        'sales_id' => $sale->id,
                        'store_id' => $sale->store_id,
                        'contact_id' => $sale->contact_id,
                        'transaction_date' => $sale->sale_date,
                        'amount' => $payment['amount'],
                        'payment_method' => $payment['payment_method'],
                    ];

                    // Check if the payment method is not 'Credit'
                    if ($payment['payment_method'] != 'Credit') {
                        // Determine transaction type based on the payment method
                        if ($payment['payment_method'] == 'Account') {
                            // Set transaction type to 'account' for account payments
                            $transactionData['transaction_type'] = 'account';
                            Contact::where('id', $sale->contact_id)->decrement('balance', $payment['amount']);

                        } else { $transactionData['transaction_type'] = 'sale';}

                        // Update the total amount received
                        $amountReceived += $payment['amount'];

                        // Create the transaction
                        Transaction::create($transactionData);
                    }
                    else if($payment['payment_method'] == 'Credit'){
                        $transactionData['transaction_type'] = 'sale';
                        Transaction::create($transactionData);
                        Contact::where('id', $sale->contact_id)->decrement('balance', $payment['amount']);
                    }
                }

                if($amountReceived >= $total) $sale->status = 'completed';

                $sale->amount_received = $amountReceived;
                $sale->save();
            }

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
                        DB::rollBack();
                        return response()->json(['error' => 'Stock for product not found in the specified store or batch'], 500);
                    }
                }
            }
            
            DB::commit();
            return response()->json(['message' => 'Sale recorded successfully!', 'sale_id' => $sale->id], 201);

        } catch (\Exception $e) {
            // Rollback transaction in case of error
            DB::rollBack();

            Log::error('Transaction failed', [
                'error_message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);

            // Return error response
            return response()->json(['error' => $e], 500);
        }
    }
}
