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
        // Lista de nombres de pisos comunes
        $floorNames = [
            'First Floor', 'Second Floor', 'Third Floor', 'Fourth Floor', 'Fifth Floor',
            'Sixth Floor', 'Seventh Floor', 'Eighth Floor', 'Ninth Floor', 'Tenth Floor'
        ];

        // Lista de ubicaciones posibles
        $locations = [
            'Building A, Left Wing', 'Building A, Right Wing', 'Building B, Left Wing', 
            'Building B, Right Wing', 'Building C, Center', 'Building D, West Wing',
            'Building E, East Wing', 'Building F, Upper Deck', 'Building G, Lower Deck'
        ];

        return [
            'name' => fake()->randomElement($floorNames), // Selecciona un nombre de piso aleatorio
            'ubication' => fake()->randomElement($locations), // Selecciona una ubicación aleatoria
            'n_zones' => fake()->numberBetween(1, 10), // Número aleatorio de zonas entre 1 y 10
        ];
    }
}
