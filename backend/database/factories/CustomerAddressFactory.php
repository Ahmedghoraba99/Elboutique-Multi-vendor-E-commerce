<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Customer;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CustomerAddress>
 */
class CustomerAddressFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
             
            // $customerIds = Customer::pluck('id')->toArray();

            return [
                'governorate' => $this->faker->state,
                'city' => $this->faker->city,
                'street' => $this->faker->streetName,
                'house_number' => $this->faker->randomNumber(3),
                'customer_id' => Customer::factory(),
            ];
    }
}
