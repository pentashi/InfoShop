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
            ['meta_key' => 'shop_logo', 'meta_value' => 'oneshop-logo.png'],
            ['meta_key' => 'sale_reciept_note', 'meta_value' => 'Thank you'],
            ['meta_key' => 'sale_print_padding_right', 'meta_value' => '35'],

        ];

        Setting::insert($settings);
    }
}
