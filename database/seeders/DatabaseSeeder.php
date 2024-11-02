<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\Hash;

use App\Models\User;
use App\Models\Store;
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

        User::factory()->create([
            'name' => 'Admin',
            'user_name'=>'admin',
            'user_role'=>'admin',
            'email' => 'test@example.com',
            'store_id' => 1,
            'password' => Hash::make('8236'),
        ]);

        Store::create([
            'name' => 'One Shop store',
            'address'=>'Your address',
            'contact_number'=>'00000001',
        ]);

        $this->call([
            ContactSeeder::class,
            SettingSeeder::class,
        ]);
    }
}
