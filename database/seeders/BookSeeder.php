<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Domain\Books\Model\Book;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Book::truncate();

        Book::factory()->count(20)->create();
    }
}
