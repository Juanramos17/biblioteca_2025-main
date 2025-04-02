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
        $bookshelf = Bookshelf::inRandomOrder()->first();
        $genre = Genre::inRandomOrder()->first();  

        return [
            'id' => fake()->uuid(),
            'ISBN' => fake()->isbn13(),  
            'title' => fake()->sentence(),
            'publisher' => fake()->company(),
            'author' => fake()->name(),
            'genre' => $genre ? $genre->name : fake()->word(),  
            'bookshelf_id' => $bookshelf->id,  
        ];
    }
}
