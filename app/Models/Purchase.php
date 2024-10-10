<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'vendor_id',
        'purchase_date',
        'total_amount', //Net total (total after discount)
        'discount',
        'amount_paid',
        'payment_status',
        'status',
        'reference_no',
        'note',
    ];

}
