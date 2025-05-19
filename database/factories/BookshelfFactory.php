<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Domain\Bookshelves\Model\Bookshelf;
use Domain\Zones\Model\Zone;
use Domain\Genres\Model\Genre;

class BookshelfFactory extends Factory
{
    protected $model = Bookshelf::class;

    public function definition(): array
    {
        
        $zone = Zone::inRandomOrder()->first();
        
        $books = fake()->numberBetween(1, 500);

        return [
            'id' => fake()->uuid(),
            'enumeration' => fake()->numberBetween(1, 20),
            'category' => $zone->category,
            'n_books' => $books,
            'zone_id' => $zone->id,
        ];
    }
}
