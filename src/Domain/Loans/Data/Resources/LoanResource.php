<?php

namespace Domain\Loans\Data\Resources;

use Carbon\Carbon;
use Domain\Bookshelves\Model\Bookshelf;
use Domain\Loans\Model\Loan;
use Spatie\LaravelData\Data;

use function Termwind\parse;

class LoanResource extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $book_id,
        public readonly string $user_id,
        public readonly string $loan_date,
        public readonly string $due_date,
        public readonly bool $isLoaned,
        public readonly string $overdue_message,
        public readonly string $created_at,
        public readonly string $updated_at,
    ) {
    }

    public static function fromModel(Loan $loan): self
    {

        $dueDate = Carbon::parse($loan->due_date);

        $daysOverdue = 0;
        if ($loan->isOverdue && $dueDate instanceof Carbon) {
            $daysOverdue = $dueDate->diffInDays(now());
        }

        $daysOverdue = intval($daysOverdue);

        $overdueMessage = $loan->isLoaned
    ? (Carbon::parse($loan->due_date)->isBefore(Carbon::today()) 
        ? Carbon::parse($loan->due_date)->diffInDays(Carbon::today()) . " días de retraso" 
        : "En tiempo")
    : "Finalizado";

        return new self(
            id: $loan->id,
            book_id: $loan->book->title,
            user_id: $loan->user->name,
            loan_date: $loan->loan_date,
            due_date: $dueDate->format('Y-m-d'), 
            isLoaned: $loan->isLoaned,
            overdue_message: $overdueMessage,  
            created_at: $loan->created_at->format('Y-m-d H:i:s'),
            updated_at: $loan->updated_at->format('Y-m-d H:i:s'),
        );
    }
}
