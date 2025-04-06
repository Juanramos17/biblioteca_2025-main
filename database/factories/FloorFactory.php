<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Domain\Floors\Model\Floor;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Floor>
 */
class FloorFactory extends Factory
{
    /**
     * The model the factory corresponds to.
     *
     * @var string
     */
    protected $model = Floor::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
    

        return [
            'name' => fake()->unique()->numberBetween(1, 20),
            'n_zones' => fake()->numberBetween(1, 10), 
        ];
    }
}
