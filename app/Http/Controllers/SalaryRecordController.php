<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SalaryRecord;
use App\Models\CashLog;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SalaryRecordController extends Controller
{
    public function store(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'employee_id' => 'required|exists:employees,id', // Assuming you have an employees table
            'salary_date' => 'required|date',
            'basic_salary' => 'required|numeric',
            'allowances' => 'nullable|numeric',
            'deductions' => 'nullable|numeric',
            'gross_salary' => 'nullable|numeric',
            'net_salary' => 'required|numeric',
            'salary_from' => 'required|string', // Change to appropriate validation
            'store_id' => 'required'
        ]);

        DB::beginTransaction();
        try {

            // Create a new salary record
            $salaryRecord = SalaryRecord::create($validatedData);

            if ($salaryRecord->salary_from == "Cash Drawer") {
                CashLog::create([
                    'transaction_date' => $salaryRecord->salary_date,  // Use expense_date as transaction_date
                    'transaction_type' => 'cash_out',  // Set the transaction type as 'withdrawal'
                    'reference_id' => $salaryRecord->id,  // The ID of the expense as the reference
                    'amount' => $salaryRecord->net_salary*-1,  // Convert the amount to its opposite value (negative)
                    'source' => 'salary',  // Set source as 'expenses'
                    'description' => $request->employee_name,  // Copy the description
                    'store_id' => $salaryRecord->store_id,  // Store ID from expense
                ]);
            }

            DB::commit();
            return response()->json(['message' => 'Salary added successfully'], 200);
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

    public function delete($id)
    {
        // Find the salary record by ID
        $salaryRecord = SalaryRecord::find($id);

        if (!$salaryRecord) {
            return response()->json(['message' => 'Salary record not found'], 404);
        }

        // Delete the salary record
        $salaryRecord->delete();

        return response()->json(['message' => 'Salary record deleted successfully'], 200);
    }
}
