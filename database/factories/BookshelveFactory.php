<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Domain\Bookshelves\Model\Bookshelve;
use Domain\Zones\Model\Zone;
use Domain\Genres\Model\Genre;

class BookshelveFactory extends Factory
{
    protected $model = Bookshelve::class;

    public function definition(): array
    {
        
        $zone = Zone::inRandomOrder()->first();
        
        return [
            'id' => fake()->uuid(),
            'name' => fake()->word(),
            'enumeration' => fake()->numberBetween(1, 100),
            'category' => $zone->category,
            'n_books' => fake()->numberBetween(0, 500),
            'zone_id' => $zone->id,
        ];
    }
}
