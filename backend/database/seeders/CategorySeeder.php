<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{

    public function run(): void
    {

        // DB::table('categories')->delete();
        dd('CATEGORIES SEEDED');
        DB::table('categories')->insert([
            [
                'name' => 'Food',
                'description' => 'High quality food'
            ],
            [
                'name' => 'Accessories',
                'description' => 'High quality accessories'
            ],
            [
                'name' => 'Clothes',
                'description' => 'High quality clothes'
            ],
            [
                'name' => 'Electronics',
                'description' => 'High quality electronics'
            ],
            [
                'name' => 'Books',
                'description' => 'High quality books'
            ],
            [
                'name' => 'Toys',
                'description' => 'High quality toys'
            ],
            [
                'name' => 'Bakery',
                'description' => 'High quality bakery'
            ],
        ]);
    }
}
