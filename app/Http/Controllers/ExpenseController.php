<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Expense;
use App\Models\Store;

class ExpenseController extends Controller
{

    public function getExpenses($filters){
        $query = Expense::query();
        $query= $query->orderBy('expense_date', 'desc');
        if(isset($filters['start_date']) && isset($filters['end_date'])){
            $query->whereBetween('expense_date', [$filters['start_date'], $filters['end_date']]);
        }

        $results = $query->paginate(25);
        $results->appends($filters);
        return $results;
    }

    public function index(Request $request){
        $filters = $request->only(['start_date', 'end_date']);
        $stores = Store::select('id', 'name')->get();
        $expenses = $this->getExpenses($filters);

        return Inertia::render('Expense/Expense', [
            'expenses' => $expenses,
            'stores'=>$stores,
            'pageLabel'=>'Expenses',
        ]);
    }

    public function store(Request $request){
        $expense = new Expense();
        $expense->description = $request->description;
        $expense->amount = $request->amount;
        $expense->expense_date = $request->expense_date;
        $expense->store_id = $request->store_id;
        $expense->save();

        return response()->json([
            'message'=>"Expense added successfully",
        ], 200);
    }

    public function delete($id)
    {
        $expense = Expense::find($id);

        if (!$expense) {
            return response()->json(['message' => 'Expense not found'], 404);
        }

        $expense->delete();

        return response()->json(['message' => 'Expense deleted successfully'], 200);
    }
}
