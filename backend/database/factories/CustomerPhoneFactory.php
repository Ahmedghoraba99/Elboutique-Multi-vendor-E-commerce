<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Customer;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CustomerPhone>
 */
class CustomerPhoneFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $customerIds = Customer::pluck('id')->toArray();
            return [
                'customer_id' => Customer::factory(),
                'phoneNumper' => $this->faker->unique()->phoneNumber,
            ];
         
    }
}
