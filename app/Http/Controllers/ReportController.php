<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CashLog;
use App\Models\Store;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function getDailyCashReport(Request $request){
        $transaction_date = $request->only(['transaction_date']);

        $stores = Store::select('id', 'name')->get();
        $cashLogs = CashLog::where('transaction_date',$transaction_date)
        ->select('transaction_date','description', 'amount','source','contacts.name')
        ->leftJoin('contacts', 'cash_logs.contact_id', '=', 'contacts.id') 
        ->get();

        return Inertia::render('Report/DailyCashReport', [
            'stores'=>$stores,
            'logs'=>$cashLogs,
            'pageLabel'=>'Daily Cash Report',
        ]);
    }

    public function storeDailyCashReport(Request $request){

        $request->validate([
            'amount' => 'required|numeric|min:0.01', // Ensure amount is a positive number
            'transaction_date' => 'required|date',
            'transaction_type' => 'required|in:deposit,withdrawal,open_cashier,close_cashier',
            'description' => 'nullable|string|max:255',
            'store_id' => 'required|exists:stores,id',
        ]);

        $amount = $request->amount;
        $description = $request->description;
        $source = $request->transaction_type;

        if ($request->transaction_type === 'deposit') {
            $amount = abs($amount);
            $actualTransactionType = 'cash_in';
        } elseif ($request->transaction_type === 'withdrawal') {
            $amount = -abs($amount);
            $actualTransactionType = 'cash_out';
        } elseif ($request->transaction_type === 'open_cashier') {
            $amount = abs($amount); // Opening cashier balance should be positive
            $actualTransactionType = 'cash_in';
            $description = $description ?: "Opening Cashier Balance";
            $source = 'deposit';
        } elseif ($request->transaction_type === 'close_cashier') {
            $amount = -abs($amount); // Closing cashier balance as negative cash out
            $actualTransactionType = 'cash_out';
            $source = 'withdrawal';
            $description = $description ?: "Closing Cashier Balance";
        }
        // Create a new Transaction instance
        $cashLog = new CashLog();
        $cashLog->description = $request->description;
        $cashLog->amount = $amount;
        $cashLog->transaction_date = $request->transaction_date;
        $cashLog->transaction_type = $actualTransactionType;
        $cashLog->store_id = $request->store_id;
        $cashLog->source=$source;
        // Save the transaction
        $cashLog->save();

        // Return a success response
        return response()->json([
            'message' => "Transaction added successfully",
        ], 200);
    }
}
