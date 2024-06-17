<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class AttributesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('attributes')->insert([
            'color' => 'Red',
            'size' => 'M',
            'width' => '10',
            'height' => '10',
            'length' => '10',
            'weight' => 'less than 500g',
            'material' => 'Cotton',
        ]);

        DB::table('attributes')->insert([
            'color' => 'Blue',
            'size' => 'L',
            'width' => '10',
            'height' => '10',
            'length' => '10',
            'weight' => 'less than 500g',
            'material' => 'Leather',
        ]);

        DB::table('attributes')->insert([
            'color' => 'Black',
            'size' => 'XL',
            'width' => '10',
            'height' => '10',
            'length' => '10',
            'weight' => 'less than 500g',
            'material' => 'Wool',
        ]);
    }
}
