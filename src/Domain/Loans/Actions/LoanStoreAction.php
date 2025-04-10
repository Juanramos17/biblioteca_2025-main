<?php

namespace Domain\Loans\Actions;

use Domain\Loans\Data\Resources\LoanResource;
use Domain\Loans\Model\Loan;
use Domain\Users\Models\User;

class LoanStoreAction
{
    public function __invoke(array $data): LoanResource
    {
        $user = User::where('email', $data['email'])->first()->id;

        $loan = Loan::create([
            'book_id' => $data['id'],
            'user_id' => $user,
            'isLoaned' => true,
            'loan_date' => now()->toDateString(),
            'due_date' => $data['date'],
        ]);

        return LoanResource::fromModel($loan);

    }
}
