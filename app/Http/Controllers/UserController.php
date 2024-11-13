<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Store;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(){
        $stores = Store::select('id', 'name')->get();
        $users=User::select('users.id','users.name','user_name', 'user_role', 'email', 'stores.name as store_name', 'users.created_at', 'store_id')->leftJoin('stores','stores.id','=','users.store_id')->where('user_role','!=','super-admin')->get();
        return Inertia::render('User/User',[
            'users'=>$users,
            'stores'=>$stores,
            'pageLabel'=>'Users',
        ]);
    }

    public function store(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:4',
            'user_name' => 'required|string|max:255|unique:users',
            'user_role' => 'required|string|exists:roles,name',
        ]);

        // Create a new user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Hash the password
            'user_name' => $request->user_name,
            'user_role' => $request->user_role,
            'store_id' => $request->store_id,
        ]);

        $user->assignRole($request->user_role);

        return Redirect::route('users.index');
    }

    public function update(Request $request, $id)
    {
        // Find the user by ID
        $user = User::findOrFail($id);

        // Validate the incoming request
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:4', // Password is optional for update
            'user_name' => 'required|string|max:255|unique:users,user_name'. $user->id,
            'user_role' => 'required|string|exists:roles,name',
        ]);

        // Update user details
        $user->name = $request->name;
        $user->email = $request->email;
        $user->user_name = $request->user_name;
        $user->user_role = $request->user_role;
        $user->store_id= $request->store_id;

        // Only update the password if it is provided
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->syncRoles($request->user_role);

        $user->save();

        return Redirect::route('users.index');
    }
}
