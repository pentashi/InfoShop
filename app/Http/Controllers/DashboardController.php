<?php

namespace App\Http\Controllers;
use Inertia\Inertia;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        // Passing some data to the React component
        $data = [
            'name' => 'John Doe',
            'email' => 'johndoe@example.com'
        ];

        // Render the 'Dashboard' component with data
        return Inertia::render('Dashboard', [
            'user' => $data,
        ]);
    }
}
