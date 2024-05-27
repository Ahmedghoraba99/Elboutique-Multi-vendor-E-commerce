<?php

namespace Database\Seeders;

use App\Models\ReportReview;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReportReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ReportReview::factory()->count(10)->create();
    }
}
