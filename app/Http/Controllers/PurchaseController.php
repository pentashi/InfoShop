<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

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
        return Inertia::render('Purchase/PurchaseForm/PurchaseForm', [
            'products' => [],
        ]);
    }

}
