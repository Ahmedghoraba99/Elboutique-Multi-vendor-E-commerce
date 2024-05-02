<?php

namespace Database\Seeders;
use App\Models\CustomerPhone;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CustomerPhoneSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CustomerPhone::factory()->count(5)->create();
    }
}
