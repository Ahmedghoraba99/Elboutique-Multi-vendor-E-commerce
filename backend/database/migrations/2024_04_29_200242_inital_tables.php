<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// return new class extends Migration
// {
//     /**
//      * Run the migrations.
//      */
//     public function up(): void
//     {
//         // start of users tables 
//         // Schema::create('admins', function (Blueprint $table) {
//         //     $table->id();
//         // });
//         Schema::create('coustmers', function (Blueprint $table) {
//             $table->id();
//         });
//         Schema::create('vendors', function (Blueprint $table) {
//             $table->id();
//         });
//         // end of users tables

//         // start of users related tables
//         Schema::create('address', function (Blueprint $table) {
//             $table->id();
//         });
//         Schema::create('coustmer_address', function (Blueprint $table) {
//             $table->id();
//         });
//         Schema::create('vendor_address', function (Blueprint $table) {
//             $table->id();
//         });
//         Schema::create('coustmer_phone', function (Blueprint $table) {
//             $table->id();
//         });
//         Schema::create('vendor_phone', function (Blueprint $table) {
//             $table->id();
//         });
//         // end of user related tables

//         // start of product tables
//         Schema::create('products', function (Blueprint $table) {
//             $table->id();
//         });
//         Schema::create('categories', function (Blueprint $table) {
//             $table->id();
//         });
//         Schema::create('tags', function (Blueprint $table) {
//             $table->id();
//         });
//         Schema::create('product_attributes', function (Blueprint $table) {
//             $table->id();
//         });
//         Schema::create('product_images', function (Blueprint $table) {
//             $table->id();
//         });

//         // end of product tables

//         // functional tables
//         Schema::create('reviews', function (Blueprint $table) {
//             $table->id();
//         });
//         Schema::create('product_report', function (Blueprint $table) {
//             $table->id();
//         });
//         Schema::create('review_report', function (Blueprint $table) {
//             $table->id();
//         });
//         Schema::create('whishlist', function (Blueprint $table) {
//             $table->id();
//         });

//         Schema::create('cart', function (Blueprint $table) {
//             $table->id();
//         });
//         Schema::create('orders', function (Blueprint $table) {
//             $table->id();
//         });
//         Schema::create('order_product', function (Blueprint $table) {
//             $table->id();
//         });

//         // payment related tables
//         Schema::create('payments', function (Blueprint $table) {
//             $table->id();
//         });
//     }

//     /**
//      * Reverse the migrations.
//      */
//     public function down(): void
//     {
//         //
//     }
// };
