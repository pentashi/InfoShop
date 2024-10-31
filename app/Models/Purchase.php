<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Purchase extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'store_id',
        'contact_id',
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
