<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'sales_id',          // Unique identifier for the sale
        'store_id',         // ID of the store
        'contact_id',      // ID of the customer
        'transaction_date', // Date and time of the transaction
        'amount',           // Amount paid
        'payment_method',   // Payment method
        'transaction_type',
        'note',
    ];
}
