<?php

namespace Database\Factories;

use Domain\Bookshelves\Model\Bookshelf;
use Domain\Zones\Model\Zone;
use Domain\Books\Model\Book;
use Domain\Genres\Model\Genre;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookFactory extends Factory
{
    protected $model = Book::class;

    public function definition(): array
    {
        $bookshelf = Bookshelf::inRandomOrder()->first();  // Asumiendo que se usa Bookshelf para referirse a los estantes de los libros.
        $genre = Genre::inRandomOrder()->first();  // Asumiendo que se usa Genre para referirse a los géneros de libros.

        return [
            'id' => fake()->uuid(),
            'ISBN' => fake()->isbn13(),  // Generando un ISBN aleatorio
            'title' => fake()->sentence(),
            'publisher' => fake()->company(),
            'author' => fake()->name(),
            'genre' => $genre ? $genre->name : fake()->word(),  // Si existe un género, usarlo, si no, generar uno aleatorio.
            'bookshelf_id' => $bookshelf->id,  // Relacionando el libro con un estante aleatorio
        ];
    }
}
