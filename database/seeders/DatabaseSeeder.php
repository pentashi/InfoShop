<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\Hash;

use App\Models\User;
use App\Models\Store;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        Store::create([
            'name' => 'One Shop store',
            'address'=>'Your address',
            'contact_number'=>'00000001',
            'sale_prefix'=>'OS',
            'current_sale_number'=>0,
        ]);

        $superAdminRole = Role::firstOrCreate(['name' => 'super-admin']);
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $userRole = Role::firstOrCreate(['name' => 'user']);

        $permissions = [
            'manage profile',       // Covers all profile actions (view, edit, delete)
            'manage dashboard',     // Covers dashboard viewing and summary actions
            'manage stores',        // Covers store creation, update, and selection
            'manage products',      // Covers products, collections, quantities, barcodes, etc.
            'manage pos',           // Covers POS actions like checkout
            'manage contacts',      // Covers customers, vendors, and contact management
            'manage sales',         // Covers sales, receipts, and sold items
            'manage purchases',     // Covers purchases and related actions
            'manage transactions',  // Covers customer/vendor transactions and payments
            'manage settings',      // Covers application settings management
            'manage expenses',      // Covers expenses creation and deletion
            'manage users',         // Covers user creation, update, and listing
            'manage reports',       // Covers viewing and storing reports
            'link storage'          // Covers linking storage action
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }
        $superAdminRole->givePermissionTo(Permission::all());

        $adminPermissions = [
            'manage profile',
            'manage dashboard',
            'manage stores',
            'manage products',
            'manage pos',
            'manage contacts',
            'manage sales',
            'manage purchases',
            'manage transactions',
            'manage settings',
            'manage expenses',
            'manage users',
            'manage reports'
        ];
        $adminRole->givePermissionTo($adminPermissions);

        $userPermissions = [
            'manage profile',
            'manage dashboard',
            'manage products',
            'manage pos'
        ];
        $userRole->givePermissionTo($userPermissions);
        
        $superAdmin=User::create([
            'name' => 'Admin',
            'user_name'=>'master',
            'user_role'=>'super admin',
            'email' => 'admin@clearcodeweb.xyz.lk',
            'store_id' => 1,
            'password' => Hash::make('8236'),
        ]);
        $superAdmin->assignRole($superAdminRole);

        $this->call([
            ContactSeeder::class,
            SettingSeeder::class,
        ]);
    }
}
