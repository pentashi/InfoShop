<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

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
}
