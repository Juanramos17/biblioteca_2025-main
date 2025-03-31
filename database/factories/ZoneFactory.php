<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Domain\Zones\Model\Zone;
use Domain\Floors\Model\Floor;
use Domain\Genres\Model\Genre;

class ZoneFactory extends Factory
{
    protected $model = Zone::class;

    public function definition(): array
    {
        $generos = Genre::all();

        $categoryName = $generos->isNotEmpty() ? $generos->random()->name : 'General';

        $floor = Floor::inRandomOrder()->first();

        return [
            'name' => fake()->numberBetween(1,10),
            'category' => $categoryName,
            'n_bookshelves' => fake()->numberBetween(1, 10),
            'floor_id' => $floor->id,
        ];
    }
}
