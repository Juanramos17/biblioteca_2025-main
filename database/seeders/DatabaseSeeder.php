<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            PermissionSeeder::class,
            UserSeeder::class,
            RoleSeeder::class,
            FloorSeeder::class,
            GenreSeeder::class,
            ZoneSeeder::class,
            BookshelfSeeder::class,
            BookSeeder::class,
            LoanSeeder::class,
            ReservationSeeder::class,
        ]);

        //migrar pulse database

    }
}
