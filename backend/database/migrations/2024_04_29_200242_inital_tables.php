<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // start of users tables 
      
        // end of user related tables

        // start of product tables
        Schema::create('products', function (Blueprint $table) {
            $table->id();
        });
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
        });
        Schema::create('tags', function (Blueprint $table) {
            $table->id();
        });
        Schema::create('product_attributes', function (Blueprint $table) {
            $table->id();
        });
        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
        });

        // end of product tables

        // functional tables
      
        Schema::create('whishlist', function (Blueprint $table) {
            $table->id();
        });

        Schema::create('cart', function (Blueprint $table) {
            $table->id();
        });


        // payment related tables
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
