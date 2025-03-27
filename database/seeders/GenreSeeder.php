<?php

namespace Database\Seeders;

use Domain\Genres\Model\Genre;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GenreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Genre::truncate();
         $genres = [
            'Fiction',
            'Mystery',
            'Thriller',
            'Science Fiction',
            'Fantasy',
            'Romance',
            'Historical',
            'Non-fiction',
            'Biography',
            'Horror',
        ];

        foreach ($genres as $genre) {
            Genre::create([
                'name' => $genre,
            ]);
        }
    }
}
