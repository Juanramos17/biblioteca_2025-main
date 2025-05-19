<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Domain\Bookshelves\Model\Bookshelf;

class BookshelfSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Bookshelf::truncate();

        Bookshelf::factory()->count(20)->create();
    }
}
