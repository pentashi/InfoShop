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

class PurchaseController extends Controller
{
    public function index()
    {
        
        return Inertia::render('Purchase/Purchase', [
            'purchases' => [],
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

        // Create a new purchase record
        $purchase = Purchase::create([
            'store_id' => $validatedData['store_id'] ?? 1,
            'vendor_id' => $validatedData['contact_id'],
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
                $transaction = PurchaseTransaction::create([
                    'purchase_id' => $purchase->id, // Assuming you want purchase_id, not sales_id
                    'store_id' => $purchase->store_id, // Assuming you have store_id from $purchase or a fixed value
                    'vendor_id' => $purchase->vendor_id, // Use the provided customer ID
                    'transaction_date' => $purchase->purchase_date,
                    'amount' => $payment['amount'], // Amount from the payment array
                    'payment_method' => $payment['payment_method'], // Payment method from the payment array
                ]);
                $purchaseAmountPaid +=$payment['amount'];
            }
        }
        $purchase->amount_paid = $purchaseAmountPaid;
        $purchase->save(); //Update amount recieved

        // Return a successful response
        return response()->json([
            'message' => 'Purchase created successfully!',
            'purchase' => '$purchase',
            'cartItems'=>$cartItems,
            'payments'=>$payments,
        ], 201);
    }

}
