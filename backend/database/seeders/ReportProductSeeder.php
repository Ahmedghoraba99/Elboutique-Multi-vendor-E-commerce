<?php

namespace Database\Seeders;

use App\Models\ReportProduct;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReportProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ReportProduct::factory()->count(10)->create();
    }
}
