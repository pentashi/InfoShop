<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Contact;
use App\Models\Store;

class PurchaseController extends Controller
{
    public function index()
    {
        
        return Inertia::render('Purchase/Purchase', [
            'products' => [],
        ]);
    }

    public function create()
    {
        $contacts = Contact::select('id', 'name','balance')->vendors()->get();
        $stores = Store::select('id', 'name')->get();
        return Inertia::render('Purchase/PurchaseForm/PurchaseForm', [
            'products' => [],
            'vendors'=>$contacts,
            'stores'=>$stores,
        ]);
    }

    public function store(Request $request)
    {
        // Validate the incoming request data
        // $validatedData = $request->validate([
        //     'store_id' => 'required|integer',
        //     'vendor_id' => 'required|integer',
        //     'purchase_date' => 'required|date',
        //     'total_amount' => 'required|numeric',
        //     'discount' => 'nullable|numeric',
        //     'amount_paid' => 'required|numeric',
        //     'reference_no' => 'nullable|string',
        //     'note' => 'nullable|string',
        // ]);

        // // Create a new purchase record
        // $purchase = Purchase::create([
        //     'store_id' => $validatedData['store_id'],
        //     'vendor_id' => $validatedData['vendor_id'],
        //     'purchase_date' => $validatedData['purchase_date'],
        //     'total_amount' => $validatedData['total_amount'],
        //     'discount' => $validatedData['discount'] ?? 0, // Optional, defaults to 0
        //     'amount_paid' => $validatedData['amount_paid'],
        //     'payment_status' => $validatedData['payment_status'] ?? 'pending',
        //     'status' => $validatedData['status'] ?? 'pending',
        //     'reference_no' => $validatedData['reference_no'] ?? null, // Optional
        //     'note' => $validatedData['note'] ?? null, // Optional
        // ]);

        // Return a successful response
        return response()->json([
            'message' => 'Purchase created successfully!',
            'purchase' => '$purchase',
        ], 201);
    }

}
