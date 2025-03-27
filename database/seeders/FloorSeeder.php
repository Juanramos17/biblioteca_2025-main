<?php

namespace Database\Seeders;

use Domain\Floors\Model\Floor;
use Illuminate\Database\Seeder;


class FloorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Floor::truncate(); 

        Floor::factory()->count(20)->create();

        
    }
}
