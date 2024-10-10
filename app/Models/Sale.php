<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',        // Store ID
        'customer_id',     // Customer ID
        'sale_date',       // Sale date
        'total_amount',    //Net total (total after discount)
        'discount',        // Discount
        'amount_received',  // Amount received
        'profit_amount',   // Profit amount
        'status',          // Sale status ['completed', 'pending', 'refunded']
        'note',            // Note
    ];

    public function getUpdatedAtAttribute($value)
    {
        return \Carbon\Carbon::parse($value)->format('Y-m-d'); // Adjust the format as needed
    }

    // Accessor for formatted created_at date
    public function getCreatedAtAttribute($value)
    {
        return \Carbon\Carbon::parse($value)->format('Y-m-d'); // Adjust the format as needed
    }

    // Accessor for formatted sale_date date
    public function getSaleDateAttribute($value)
    {
        return \Carbon\Carbon::parse($value)->format('Y-m-d'); // Adjust the format as needed
    }
}
