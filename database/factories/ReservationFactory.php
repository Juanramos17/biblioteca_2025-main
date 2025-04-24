<?php

namespace Database\Factories;

use Domain\Books\Model\Book;
use Domain\Reservations\Model\Reservation;
use Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Reservation>
 */

class ReservationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Reservation::class;
    public function definition(): array
    {
        $user = User::inRandomOrder()->first();
        $book = Book::inRandomOrder()->first();

        return [
            'user_id' => $user->id,
            'book_id' => $book->id,
        ];
    }
}
