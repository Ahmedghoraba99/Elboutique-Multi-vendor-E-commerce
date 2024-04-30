<?php

namespace Database\Factories;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Vendor>
 */
class VendorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
             
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'address' => fake()->address(),
            'image'=>fake()->image(),
            'phone'=>fake()->phoneNumber(),
            'remember_token' => Str::random(10),
            'password' => bcrypt('password'),
            'national_id' => fake()->image(),
        ];
    }
}
