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

}
