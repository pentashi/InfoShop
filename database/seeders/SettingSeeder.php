<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            ['meta_key' => 'shop_name', 'meta_value' => 'One shop'],
            ['meta_key' => 'shop_logo', 'meta_value' => ''],
            ['meta_key' => 'sale_reciept_note', 'meta_value' => 'Thank you'],
        ];

        Setting::insert($settings);
    }
}
