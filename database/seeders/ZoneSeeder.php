<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Domain\Zones\Model\Zone;

class ZoneSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Limpiar la tabla de zonas antes de insertar datos
        Zone::truncate();

        // Crear 10 zonas utilizando el factory
        Zone::factory()->count(10)->create();
    }
}
