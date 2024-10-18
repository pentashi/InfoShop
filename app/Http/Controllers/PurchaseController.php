<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Contact;
use App\Models\Store;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\ProductBatch;
use App\Models\ProductStock;
use App\Models\PurchaseTransaction;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PurchaseController extends Controller
{
    public function index()
    {
        $purchases = DB::table('purchases AS pr')
        ->select(
            'pr.id',
            'pr.contact_id',            // Customer ID
            'pr.purchase_date',              // Purchase date
            'pr.total_amount',           // Total amount (Total amount after discount [net_total - discount])
            'pr.amount_paid', 
            'pr.discount',                // Discount
            'pr.store_id',
            'pr.status',
            'c.name', // Customer name from contacts
        )
        ->leftJoin('contacts AS c', 'pr.contact_id', '=', 'c.id') // Join with contacts table using customer_id
        ->orderBy('pr.id','desc')
        ->get();
        return Inertia::render('Purchase/Purchase', [
            'purchases' => $purchases,
            'pageLabel'=>'Purchases',
        ]);
    }

    public function create()
    {
        $contacts = Contact::select('id', 'name','balance')->vendors()->get();
        $stores = Store::select('id', 'name')->get();
        return Inertia::render('Purchase/PurchaseForm/PurchaseForm', [
            'products' => [],
            'vendors'=>$contacts,
            'stores'=>$stores,
            'pageLabel'=>'New Purchase',
        ]);
    }

    public function store(Request $request)
    {
        //Validate the incoming request data
        $validatedData = $request->validate([
            'store_id' => 'required|integer',
            'contact_id' => 'required|integer',
            'purchase_date' => 'required|date',
            'net_total' => 'required|numeric',
            'discount' => 'nullable|numeric',
            'reference_no' => 'nullable|string',
            'note' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try{
            // Create a new purchase record
            $purchase = Purchase::create([
                'store_id' => $validatedData['store_id'] ?? 1,
                'contact_id' => $validatedData['contact_id'],
                'purchase_date' => $validatedData['purchase_date'],
                'total_amount' => $validatedData['net_total'], //Total after discount
                'discount' => $validatedData['discount'] ?? 0, // Optional, defaults to 0
                'amount_paid' => $request->amount_paid ?? 0,
                'payment_status' => $validatedData['payment_status'] ?? 'pending',
                'status' => $validatedData['status'] ?? 'pending',
                'reference_no' => $validatedData['reference_no'] ?? null, // Optional
                'note' => $validatedData['note'] ?? null, // Optional
            ]);

            $cartItems = $request->cartItems;
            $payments = $request->payments;

            foreach ($cartItems as $item) {
                // Create a new purchase item
                PurchaseItem::create([
                    'purchase_id' => $purchase->id, // Associate the purchase item with the newly created purchase
                    'product_id' => $item['id'], // Product ID (assuming you have this)
                    'batch_id' => $item['batch_id'], // Batch ID from the cart item
                    'quantity' => $item['quantity'], // Quantity purchased
                    'unit_price' => $item['price'], // Purchase price per unit
                    'unit_cost' => $item['cost'], // Cost price per unit
                ]);
            
                // Retrieve or create the product stock using store_id and batch_id
                $productStock = ProductStock::firstOrCreate(
                    [
                        'store_id' => $purchase->store_id,
                        'batch_id' => $item['batch_id'],
                    ],
                    [
                        'quantity' => 0,  // Initial quantity for new stock
                    ]
                );

                // Update the quantity in stock
                $productStock->quantity += $item['quantity'];
                $productStock->save();

                // Update the ProductBatch for price and cost
                $productBatch = ProductBatch::find($item['batch_id']);

                if ($productBatch) {
                    // Directly update the price and cost
                    $productBatch->price = $item['price']; // Set the purchase price
                    $productBatch->cost = $item['cost'];   // Set the cost

                    // Save the updated product batch
                    $productBatch->save();
                }
            }
            
            $purchaseAmountPaid = 0;
            foreach ($payments as $payment) {
                if($payment['payment_method'] != 'Credit')
                {
                    $transactionData = [
                        'purchase_id' => $purchase->id,
                        'store_id' => $purchase->store_id,
                        'contact_id' => $purchase->contact_id,
                        'transaction_date' => now(),
                        'amount' => $payment['amount'], // Amount from the payment array
                        'payment_method' => $payment['payment_method'],
                    ];

                    // Determine transaction type based on the payment method
                    if ($payment['payment_method'] == 'Account') {
                        // Set transaction type to 'account_deposit' for account payments
                        $transactionData['transaction_type'] = 'account_deposit';
                        Contact::where('id', $purchase->contact_id)->decrement('balance', $payment['amount']);
                    } else {
                        // Set transaction type to 'sale' for other payment methods
                        $transactionData['transaction_type'] = 'purchase';
                    }

                    // Update the total amount received
                    $purchaseAmountPaid += $payment['amount'];

                    // Create the transaction
                    $transaction = PurchaseTransaction::create($transactionData);
                }
            }
            if($purchaseAmountPaid >= $purchase->total_amount) $purchase->status = 'completed';
            $purchase->amount_paid = $purchaseAmountPaid;
            $purchase->save(); //Update amount recieved

            DB::commit();
            // Return a successful response
            return response()->json([
                'message' => 'Purchase created successfully!',
                'purchase' => '$purchase',
                'cartItems'=>$cartItems,
                'payments'=>$payments,
            ], 201);

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
