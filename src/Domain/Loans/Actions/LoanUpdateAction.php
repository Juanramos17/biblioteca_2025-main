<?php

namespace Domain\Loans\Actions;

use Domain\Loans\Data\Resources\LoanResource;
use Domain\Loans\Model\Loan;

class LoanUpdateAction
{
    public function __invoke(Loan $loan, array $data): LoanResource
    {
        $updateData = [
            'enumeration' => $data['enumeration'],
            'category' => $data['category'],
            'n_books' => $data['n_books'],
            'zone_id' => $data['zone_id'],
        ];

        $loan->update($updateData);

        return LoanResource::fromModel($loan->fresh());
    }
}
