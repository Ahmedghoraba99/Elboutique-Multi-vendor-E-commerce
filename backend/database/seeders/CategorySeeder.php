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
        // dd('CATEGORIES SEEDED');
        DB::table('categories')->insert([
            [
                'name' => 'Food',
                'description' => 'High quality food',
                'image' => '1.jpg'
            ],
            [
                'name' => 'Accessories',
                'description' => 'High quality accessories',
                'image' => '1.jpg'
            ],
            [
                'name' => 'Clothes',
                'description' => 'High quality clothes',
                'image' => '1.jpg'
            ],
            [
                'name' => 'Electronics',
                'description' => 'High quality electronics',
                'image' => '1.jpg'
            ],
            [
                'name' => 'Books',
                'description' => 'High quality books',
                'image' => '1.jpg'
            ],
            [
                'name' => 'Toys',
                'description' => 'High quality toys',
                'image' => '1.jpg'
            ],
            [
                'name' => 'Bakery',
                'description' => 'High quality bakery',
                'image' => '1.jpg'
            ],
        ]);
    }
}
