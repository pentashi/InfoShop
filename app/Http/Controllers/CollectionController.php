<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Redirect;

class CollectionController extends Controller
{
    public function index()
    {
        // Fetch data from the Collection model
        $collections = Collection::select('id', 'name', 'collection_type', 'description', 'created_at')->get();
        
        // Render the Inertia view with the collections data
        return Inertia::render('Collection/Collection', [
            'collections' => $collections,
            'pageLabel'=>'Collections',
        ]);
    }

    public function store(Request $request)
    {
        // 3. Validate the incoming request
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'collection_type' => 'required|string|max:50',
            'description' => 'nullable|string',
        ]);

        // 4. Save the data to the database
        $collection = Collection::create($validatedData);

        return redirect()->route('collection')->with('success', 'Collection created successfully!');
    }

    public function update(Request $request, $id)
    {
        $collection = Collection::findOrFail($id);
        // 1. Validate the incoming request
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'collection_type' => 'required|string|max:50',
            'description' => 'nullable|string',
        ]);

        // 2. Update the data in the database
        $collection->update($validatedData);

        return redirect()->route('collection')->with('success', 'Collection updated successfully!');
    }
}
