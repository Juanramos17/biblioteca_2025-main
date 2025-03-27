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
       
        $locations = [
            'Building A, Left Wing', 'Building A, Right Wing', 'Building B, Left Wing', 
            'Building B, Right Wing', 'Building C, Center', 'Building D, West Wing',
            'Building E, East Wing', 'Building F, Upper Deck', 'Building G, Lower Deck'
        ];

        return [
            'name' => fake()->unique()->numberBetween(1, 20),
            'ubication' => fake()->randomElement($locations), 
            'n_zones' => fake()->numberBetween(1, 10), 
        ];
    }
}
