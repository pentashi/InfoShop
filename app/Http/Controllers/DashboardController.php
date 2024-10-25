<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\ProductStock;
use App\Models\SaleItem;
use App\Models\Contact;
use App\Models\Sale;
use App\Models\Transaction;
use App\Models\Expense;

use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $data['totalItems'] = number_format(Product::count());
        $data['soldItems'] = number_format(SaleItem::sum('quantity'));
        $data['totalQuantities']=number_format(ProductStock::sum('quantity'));

        $totalValuation = ProductStock::join('product_batches', 'product_stocks.batch_id', '=', 'product_batches.id')
            ->select(DB::raw('SUM(product_stocks.quantity * product_batches.cost) as total_valuation'))
            ->value('total_valuation');

        $customerBalance = Contact::customers()->sum('balance');
        $data['totalValuation'] = number_format($totalValuation);
        $data['customerBalance'] = number_format($customerBalance);
        
         // Render the 'Dashboard' component with data
        return Inertia::render('Dashboard', [
            'pageLabel'=>'Dashboard',
            'data'=>$data,
        ]);
    }

    public function getDashboardSummary(Request $request){
        $startDate = $request->start_date;
        $endDate = $request->end_date;

        $data['total_sales'] = Sale::whereBetween('sale_date', [$startDate, $endDate])->sum('total_amount');
        $data['cash_in'] = Transaction::where('payment_method','cash')->whereBetween('transaction_date', [$startDate, $endDate])->sum('amount');
        $data['expenses'] = Expense::whereBetween('expense_date', [$startDate, $endDate])->sum('amount');
        return response()->json([
            'summary'=>$data,
        ], 200);
    }
}
