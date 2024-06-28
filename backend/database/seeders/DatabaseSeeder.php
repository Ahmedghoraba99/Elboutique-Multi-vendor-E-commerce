<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Category;
use App\Models\ReportProduct;
use Faker\Provider\ar_EG\Address;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();
        $this->call([
            AdminSeeder::class,
            VendorSeeder::class,
            CustomerSeeder::class,
            CustomerAddressSeeder::class,
            CustomerPhoneSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            ReviewSeeder::class,
            ReportProductSeeder::class,
            ReportReviewSeeder::class,
        ]);

    }
}
