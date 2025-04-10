<?php

namespace Database\Factories;

use Domain\Books\Model\Book;
use Domain\Loans\Model\Loan;
use Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class LoanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Loan ::class;
    public function definition(): array
    {
        $user = User::inRandomOrder()->first();
        $book = Book::inRandomOrder()->first();

        $loanDate = $this->faker->dateTimeBetween('-2 months', 'now');
        $dueDate = (clone $loanDate)->modify('+14 days');

        $isLoaned = $this->faker->boolean(70);

        return [
            'user_id' => $user->id,
            'book_id' => $book->id,
            'isLoaned' => $isLoaned,
            'loan_date' => $loanDate->format('Y-m-d'),
            'due_date' => $dueDate->format('Y-m-d'),
        ];
    }
}
