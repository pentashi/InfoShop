<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Userstamps;


class Expense extends Model
{
    use HasFactory;
    use SoftDeletes;
    use Userstamps;

    protected $fillable = ['description', 'amount', 'expense_date', 'store_id'];
}
