<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Redirect;

class StoreController extends Controller
{
    public function index()
    {
        $stores = Store::select('id','name', 'address', 'contact_number', 'created_at')->get();
        return Inertia::render('Store/Store', [
            'stores' => $stores,
            'pageLabel'=>'Stores',
        ]);
    }

    public function store(Request $request)
    {
        // 3. Validate the incoming request
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'contact_number' => 'required|string|max:50',
        ]);

        // 4. Save the data to the database
        $store = Store::create($validatedData);

        return Redirect::route('store')->with('success', 'Store created successfully!');
    }

    public function update(Request $request, $id)
    {
        // Find the store by ID
        $store = Store::findOrFail($id);

        // Validate the incoming request
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'contact_number' => 'required|string|max:50',
        ]);

        // Update the store record
        $store->update($validatedData);

        // Redirect with success message
        return Redirect::route('store')->with('success', 'Store updated successfully!');
    }

}
