<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // $orders = Order::all();
        // $products = Product::all();

        // $orders->each(function ($order) use ($products) {
        //     $order->products()->attach(
        //         $products->random(rand(1, 5))->pluck('id')->toArray(),
        //         ['quantity' => rand(1, 10)]
        //     );
        // });
    }
}
