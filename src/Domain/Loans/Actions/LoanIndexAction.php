<?php

namespace Domain\Loans\Actions;

use Carbon\Carbon;
use Domain\Books\Model\Book;
use Domain\Loans\Data\Resources\LoanResource;
use Domain\Loans\Model\Loan;
use Domain\Users\Models\User;

class LoanIndexAction
{
    public function __invoke(?array $search = null, int $perPage = 10)
    {
        $title = $search[0];
        $user = $search[1];
        $loan_date = $search[2];
        $due_date = $search[3];
        $isLoaned = $search[4];

        $bookIds = [];
        if ($title !== "null") {
            $bookIds = Book::where('title', 'like', '%' . $title . '%')
                ->pluck('id')
                ->toArray();
        }

        $userIds = [];
        if ($user !== "null") {
            $userIds = User::where('name', 'like', '%' . $user . '%')
                ->pluck('id')
                ->toArray();
        }
        

        
        $loans = Loan::query()
            ->when(!empty($bookIds), function ($query) use ($bookIds) {
                $query->whereIn('book_id', $bookIds);
            })
            ->when(!empty($userIds), function ($query) use ($userIds) {
                $query->whereIn('user_id', $userIds);
            })
            ->when($loan_date !== "null", function ($query) use ($loan_date) {
                $query->whereDate('loan_date', '=', $loan_date);
            })
            ->when($due_date !== "null", function ($query) use ($due_date) {
                $query->whereDate('due_date',"=", $due_date);
            })
            ->when($isLoaned !== "null", function ($query) use ($isLoaned) {
                $query->where('isLoaned',"=", $isLoaned);
            })
            ->latest()
            ->paginate($perPage);

        return $loans->through(fn($loan) => LoanResource::fromModel($loan));
    }
}
