<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
         // Render the 'Dashboard' component with data
        return Inertia::render('Dashboard', [
            'pageLabel'=>'Dashboard'
        ]);
    }
}
