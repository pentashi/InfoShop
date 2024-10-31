<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contact extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'name',         // Name of the contact (both customers and vendors)
        'email',        // Contact's email
        'phone',        // Phone number
        'address',      // Address
        'balance',      // Account balance
        'loyalty_points', // Loyalty points for customers (nullable for vendors)
        'type',         // Type of contact: customer or vendor
    ];


    // $customers = Contact::customers()->get();
    public function scopeCustomers($query)
    {
        return $query->where('type', 'customer');
    }

    // Contact::vendors()->get();
    public function scopeVendors($query)
    {
        return $query->where('type', 'vendor');
    }

    // Accessor for formatted created_at date
    public function getCreatedAtAttribute($value)
    {
        return \Carbon\Carbon::parse($value)->format('Y-m-d'); // Adjust the format as needed
    }
}
