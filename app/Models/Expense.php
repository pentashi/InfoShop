<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Userstamps;
use App\Models\CashLog;

class Expense extends Model
{
    use HasFactory;
    use SoftDeletes;
    use Userstamps;

    protected $fillable = ['description', 'amount', 'expense_date', 'store_id'];

    protected static function booted()
    {
        //Create a cash log on expense
        static::created(function ($expense) {
            // After an expense is created, create a related Cash Log
            $expense->createCashLog();
        });

        //Delete a cash log on expense delete
        static::deleted(function ($expense) {

            CashLog::where('reference_id', $expense->id)
                ->where('source', 'expenses')
                ->delete();  // Delete the CashLog
        });
    }

    public function createCashLog()
    {
        $convertedAmount = -$this->amount;
        $transactionType = $convertedAmount < 0 ? 'cash_out' : 'cash_in';

        // Create the cash log entry using the values from the expense
        CashLog::create([
            'transaction_date' => $this->expense_date,  // Use expense_date as transaction_date
            'transaction_type' => $transactionType,  // Set the transaction type as 'withdrawal'
            'reference_id' => $this->id,  // The ID of the expense as the reference
            'amount' => $convertedAmount,  // Convert the amount to its opposite value (negative)
            'source' => 'expenses',  // Set source as 'expenses'
            'description' => $this->description,  // Copy the description
            'store_id' => $this->store_id,  // Store ID from expense
        ]);
    }
}
