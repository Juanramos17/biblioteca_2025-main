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
        
        return [
            'id' => fake()->uuid(),
            'enumeration' => fake()->numberBetween(1, 100),
            'n_shelves' => fake()->numberBetween(1, 100),
            'category' => $zone->category,
            'n_books' => fake()->numberBetween(0, 500),
            'zone_id' => $zone->id,
        ];
    }
}
