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
        // Limpiar la tabla de zonas antes de insertar datos
        Bookshelf::truncate();

        // Crear 10 zonas utilizando el factory
        Bookshelf::factory()->count(10)->create();
    }
}
