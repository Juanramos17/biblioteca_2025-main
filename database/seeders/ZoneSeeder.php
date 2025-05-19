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
        Zone::truncate();

        Zone::factory()->count(20)->create();
    }
}
