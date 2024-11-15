<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CashLog;
use App\Models\Store;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Sale;

class ReportController extends Controller
{
    public function getDailyCashReport(Request $request)
    {
        $transaction_date = $request->only(['transaction_date']);

        if (empty($transaction_date)) $transaction_date = Carbon::today()->toDateString();

        $stores = Store::select('id', 'name')->get();
        $cashLogs = CashLog::where('transaction_date', $transaction_date)
            ->select('transaction_date', 'description', 'amount', 'source', 'contacts.name')
            ->leftJoin('contacts', 'cash_logs.contact_id', '=', 'contacts.id')
            ->get();

        return Inertia::render('Report/DailyCashReport', [
            'stores' => $stores,
            'logs' => $cashLogs,
            'pageLabel' => 'Daily Cash Report',
        ]);
    }

    public function storeDailyCashReport(Request $request)
    {

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
        $cashLog->source = $source;
        // Save the transaction
        $cashLog->save();

        // Return a success response
        return response()->json([
            'message' => "Transaction added successfully",
        ], 200);
    }

    public function getContactStatement(Request $request)
    {
        $transaction_date = $request->only(['transaction_date']);

        if (empty($transaction_date)) $transaction_date = Carbon::today()->toDateString();

        $stores = Store::select('id', 'name')->get();
        $cashLogs = CashLog::where('transaction_date', $transaction_date)
            ->select('transaction_date', 'description', 'amount', 'source', 'contacts.name')
            ->leftJoin('contacts', 'cash_logs.contact_id', '=', 'contacts.id')
            ->get();

        return Inertia::render('Report/ContactStatement', [
            'stores' => $stores,
            'logs' => $cashLogs,
            'pageLabel' => 'Contact Statements',
        ]);
    }

    public function getSalesReport(Request $request)
    {
        $start_date = $request->input('start_date', Carbon::today()->toDateString());
        $end_date = $request->input('end_date', Carbon::today()->toDateString());

        // Filter Sales within the specified date range
        $salesQuery = Sale::with(['transactions' => function ($query) use ($start_date, $end_date) {
            // Filter transactions within the date range
            $query->whereBetween('transaction_date', [$start_date, $end_date])
                ->where('payment_method', '!=', 'Credit')
                ->select('id', 'sales_id', 'transaction_date', 'amount', 'payment_method', 'transaction_type')
                ->orderBy('transaction_date', 'asc');
        }])
            ->select('id', 'invoice_number', 'sale_date', 'total_amount', 'profit_amount', 'status', 'store_id', 'discount')
            ->whereBetween('sale_date', [$start_date, $end_date]) // Filter Sales within the specified date range
            ->orderBy('sale_date', 'desc');

        // Execute the query to get the sales
        $sales = $salesQuery->get();
        $report = [];

        // Loop through each sale to build the report
        foreach ($sales as $sale) {
            // Add the Sale record to the report
            $report[] = [
                'date' => $sale->sale_date,
                'description' => "Sale #{$sale->invoice_number}",
                'receivable' => $sale->total_amount,
                'settled' => 0, // To be calculated based on transactions
                'profit' => $sale->profit_amount,
            ];

            // Add the related Transaction records
            foreach ($sale->transactions as $transaction) {
                $transactionDescription = ucfirst($transaction->payment_method) . ' | #' . $sale->invoice_number;
                $report[] = [
                    'date' => $transaction->transaction_date,
                    'description' => $transactionDescription,
                    'receivable' => 0, // Transactions don’t affect receivables
                    'settled' => $transaction->amount, // Amount settled in the transaction
                    'profit' => 0, // Transactions don’t affect profit directly
                ];
            }
        }

        usort($report, function ($a, $b) {
            return strtotime($a['date']) - strtotime($b['date']);
        });

        // return response()->json($report);

        $stores = Store::select('id', 'name')->get();
        return Inertia::render('Report/SalesReport', [
            'stores' => $stores,
            'report' => $report,
            'pageLabel' => 'Sales Report',
        ]);
    }
}
