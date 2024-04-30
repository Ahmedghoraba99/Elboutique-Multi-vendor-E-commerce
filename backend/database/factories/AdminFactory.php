<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Admin>
 */
class AdminFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'fname' => fake()->name(),
            'lname' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'address' => fake()->address(),
            'image'=>fake()->image(),
            'phone'=>fake()->phoneNumber(),
            'password' => bcrypt('password'),
            'remember_token' => Str::random(10),
        ];
    }
}
