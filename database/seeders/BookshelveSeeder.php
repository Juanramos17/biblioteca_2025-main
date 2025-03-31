<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Domain\Bookshelves\Model\Bookshelve;

class BookshelveSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Limpiar la tabla de zonas antes de insertar datos
        Bookshelve::truncate();

        // Crear 10 zonas utilizando el factory
        Bookshelve::factory()->count(10)->create();
    }
}
