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
        // Limpiar la tabla de zonas antes de insertar datos
        Book::truncate();

        // Crear 10 zonas utilizando el factory
        Book::factory()->count(10)->create();
    }
}
