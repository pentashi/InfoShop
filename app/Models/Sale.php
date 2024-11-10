<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Store;
use Illuminate\Support\Facades\DB;

class Sale extends Model
{
    use HasFactory;
    use SoftDeletes;
    
    protected $fillable = [
        'invoice_number',
        'store_id',        // Store ID
        'contact_id',     // Customer ID
        'sale_date',       // Sale date
        'total_amount',    //Net total (total after discount)
        'discount',        // Discount
        'amount_received',  // Amount received
        'profit_amount',   // Profit amount
        'status',          // Sale status ['completed', 'pending', 'refunded']
        'note',        // Note
        'created_by',
    ];

    protected static function boot()
    {
        parent::boot();

        static::created(function ($sale) {
            DB::transaction(function () use ($sale) {
                $store = Store::find($sale->store_id);
                if ($store) {
                    $sale_number = $store->current_sale_number+1;
                    $year = $sale->sale_date instanceof \Carbon\Carbon 
                        ? $sale->sale_date->year 
                        : \Carbon\Carbon::parse($sale->sale_date)->year;
                    $padded_sale_id = str_pad($sale->id, 4, '0', STR_PAD_LEFT);
                    // Generate the invoice number based on the sale prefix and current sale number
                    $sale->invoice_number = $year.'/'.$padded_sale_id.'/'.str_pad($sale_number, 4, '0', STR_PAD_LEFT);

                    // Save the updated invoice number
                    $sale->save();

                    // Increment the current sale number in the store
                    $store->increment('current_sale_number');
                }
            });
        });
    }

    protected $casts = [
        'sale_date' => 'datetime',  // or 'date' if you don't need the time
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
