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
            'profile',       // Covers all profile actions (view, edit, delete)
            'dashboard',     // Covers dashboard viewing and summary actions
            'stores',        // Covers store creation, update, and selection
            'products',      // Covers products, collections, quantities, barcodes, etc.
            'pos',           // Covers POS actions like checkout
            'contacts',      // Covers customers, vendors, and contact management
            'sales',         // Covers sales, receipts, and sold items
            'purchases',     // Covers purchases and related actions
            'transactions',  // Covers customer/vendor transactions and payments
            'settings',      // Covers application settings management
            'expenses',      // Covers expenses creation and deletion
            'users',         // Covers user creation, update, and listing
            'reports',       // Covers viewing and storing reports
            'reload'          // Covers linking storage action
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }
        $superAdminRole->givePermissionTo(Permission::all());

        $adminPermissions = [
            'profile',
            'dashboard',
            'stores',
            'products',
            'pos',
            'contacts',
            'sales',
            'purchases',
            'transactions',
            'settings',
            'expenses',
            'users',
            'reports',
            'reload'
        ];
        $adminRole->givePermissionTo($adminPermissions);

        $userPermissions = [
            'profile',
            'dashboard',
            'products',
            'pos'
        ];
        $userRole->givePermissionTo($userPermissions);
        
        $superAdmin=User::create([
            'name' => 'Admin',
            'user_name'=>'master',
            'user_role'=>'super-admin',
            'email' => 'master@clearcodeweb.xyz.lk',
            'store_id' => 1,
            'password' => Hash::make('8236'),
        ]);
        $superAdmin->assignRole($superAdminRole);

        $admin=User::create([
            'name' => 'Admin',
            'user_name'=>'admin',
            'user_role'=>'admin',
            'email' => 'admin@clearcodeweb.xyz.lk',
            'store_id' => 1,
            'password' => Hash::make('8236'),
        ]);
        $admin->assignRole($adminRole);

        $this->call([
            ContactSeeder::class,
            SettingSeeder::class,
        ]);
    }
}
