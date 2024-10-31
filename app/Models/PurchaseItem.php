<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PurchaseItem extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'purchase_id',
        'product_id',
        'batch_id',
        'quantity',
        'unit_price',
        'unit_cost',
        'discount',
    ];
}
