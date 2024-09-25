<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        // $user = Auth::user();

         // Render the 'Dashboard' component with data
        return Inertia::render('Product/Product', [
            'products' => 'sample product',
        ]);
    }
}
