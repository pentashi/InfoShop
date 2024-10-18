<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Transaction;
use App\Models\PurchaseTransaction;
use App\Models\Purchase;
use App\Models\Contact;
use App\Models\Sale;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TransactionController extends Controller
{
    public function storeCustomerTransaction(Request $request){
        $amount = $request->input('amount');
        $paymentMethod = $request->input('payment_method');
        $transactionDate = $request->input('transaction_date');
        $note = $request->input('note');
        $contactId = $request->input('contact_id');
        $saleID = $request->input('transaction_id');
        $storeId = $request->input('store_id');

        $transactionData = [
            'sales_id' => $saleID,
            'store_id' => $storeId,
            'contact_id' => $contactId,
            'transaction_date' => $transactionDate,
            'amount' => $amount,
            'payment_method' => $paymentMethod,
        ];

        DB::beginTransaction();
        try{
            $transactionData['transaction_type'] = 'account_deposit';
            if($paymentMethod=='Account' && $request->has('transaction_id')) {
                Contact::where('id', $contactId)->decrement('balance', $amount);
            }
            elseif($paymentMethod !='Account' && $request->has('transaction_id')){
                $transactionData['transaction_type'] = 'sale';
            }
            else{
                Contact::where('id', $contactId)->increment('balance', $amount);
            }
            
            $transaction = Transaction::create($transactionData);

            if($request->has('transaction_id')){
                $sale = Sale::where('id', $saleID)->first();
                if ($sale) {
                    // Increment the amount_received field by the given amount
                    $sale->increment('amount_received', $amount);
                
                    // Check if the total amount received is greater than or equal to the total amount
                    if ($sale->amount_received >= $sale->total_amount) $sale->status = 'completed';
                
                    // Save the changes to the Sale record
                    $sale->save();
                }
            }


            DB::commit();
            return response()->json([
                'message'=>"Payment added successfully",
            ], 200);

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

    public function storeVendorTransaction(Request $request){
        $amount = $request->input('amount');
        $paymentMethod = $request->input('payment_method');
        $transactionDate = $request->input('transaction_date');
        $note = $request->input('note');
        $contactId = $request->input('contact_id');
        $purchaseID = $request->input('transaction_id');
        $storeId = $request->input('store_id');

        $transactionData = [
            'purchase_id' => $purchaseID,
            'store_id' => $storeId,
            'contact_id' => $contactId,
            'transaction_date' => $transactionDate,
            'amount' => $amount,
            'payment_method' => $paymentMethod,
        ];

        DB::beginTransaction();
        try{
            $transactionData['transaction_type'] = 'account_deposit';
            if($paymentMethod=='Account' && $request->has('transaction_id')) {
                Contact::where('id', $contactId)->decrement('balance', $amount);
            }
            elseif($paymentMethod !='Account' && $request->has('transaction_id')){
                $transactionData['transaction_type'] = 'sale';
            }
            else{
                Contact::where('id', $contactId)->increment('balance', $amount);
            }
            
            $transaction = PurchaseTransaction::create($transactionData);

            if($request->has('transaction_id')){
                $purchase = Purchase::where('id', $purchaseID)->first();
                if ($purchase) {
                    // Increment the amount_received field by the given amount
                    $purchase->increment('amount_paid', $amount);
                
                    // Check if the total amount received is greater than or equal to the total amount
                    if ($purchase->amount_paid >= $purchase->total_amount) $purchase->status = 'completed';
                
                    // Save the changes to the Sale record
                    $purchase->save();
                }
            }


            DB::commit();
            return response()->json([
                'message'=>"Payment added successfully",
            ], 200);

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
            return response()->json(['error' => 'Trnsaction failed'], 500);
        }
    }

    public function getPayments($type){
        if($type==='sales'){
            return Transaction::select('transactions.id', 'sales_id as reference_id', 'store_id', 'contact_id', 'contacts.name as contact_name', 'transaction_date', 'amount', 'payment_method', 'transactions.transaction_type')
            ->join('contacts', 'contact_id', '=', 'contacts.id')
            ->orderBy('transaction_date', 'desc')
            ->paginate(25);
        }
        else{
            return PurchaseTransaction::select('purchase_transactions.id', 'purchase_id as reference_id', 'store_id', 'contact_id', 'contacts.name as contact_name', 'transaction_date', 'amount', 'payment_method', 'transaction_type')
            ->join('contacts', 'contact_id', '=', 'contacts.id')
            ->orderBy('transaction_date', 'desc')
            ->paginate(25);
        }
    }

    public function viewPayments(Request $request, $type='sales'){
        $transactions = $this->getPayments($type);

        return Inertia::render('Payment/Payment', [
            'payments' => $transactions,
            'transactionType'=>$type,
            'pageLabel'=>'Payments',
        ]);
    }
}
