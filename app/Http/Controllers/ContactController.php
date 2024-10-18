<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;
use App\Models\Collection;
use App\Models\Store;

use Inertia\Inertia;
use Inertia\Response;
use Redirect;

class ContactController extends Controller
{
    public function index($type)
    {
        // Fetch data from the Collection model
        $contacts = Contact::select('id', 'name','phone','email','address', 'balance','created_at')->where('id','!=','1');
        $stores = Store::select('id', 'name')->get();
        // Apply the scope based on the type
        if ($type === 'customer') {
            $contacts = $contacts->customers()->get();
        } elseif ($type === 'vendor') {
            $contacts = $contacts->vendors()->get(); // Assuming you have a vendors scope
        } else {
            // Optionally handle other types or default behavior
            $contacts = $contacts->get();
        }

        // Render the Inertia view with the collections data
        return Inertia::render('Contact/Contact', [
            'contacts' => $contacts,
            'stores'=>$stores,
            'type' =>$type,
            'pageLabel'=>$type.'s',
        ]);
    }

    public function store(Request $request)
    {
        // Validate and create a new contact in one step
        $contact = Contact::create(array_merge(
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'nullable|email|max:255',
                'phone' => 'nullable|string|max:15',
                'address' => 'nullable|string|max:255',
                'type' => 'required|string|in:customer,vendor', // Only allow specific types
            ]),
            ['balance' => 0] // Append 'balance' manually with a default value of 0
        ));

        // Return a success response
        return response()->json([
            'status' => 'success',
            'message' => 'Contact created successfully',
            'data' => $contact
        ], 201);
    }

    public function update(Request $request, $id)
    {
        // Find the contact by ID or fail with a 404
        $contact = Contact::findOrFail($id);

        // Validate and update the contact in one step
        $contact->update($request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:15',
            'address' => 'nullable|string|max:255',
            'type' => 'required|string|in:customer,vendor',
        ]));

        // Return a success response
        return response()->json([
            'status' => 'success',
            'message' => 'Contact updated successfully',
            'data' => $contact
        ], 200);
    }
}
