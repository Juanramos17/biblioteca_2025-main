<?php

namespace Domain\Loans\Actions;

use Domain\Loans\Data\Resources\LoanResource;
use Domain\Loans\Model\Loan;

class LoanStoreAction
{
    public function __invoke(array $data): LoanResource
    {
        $loan = Loan::create([
            'enumeration' => $data['enumeration'],
            'category' => $data['category'],
            'n_books' => $data['n_books'],
            'zone_id' => $data['zone_id'],
        ]);

        
        return LoanResource::fromModel($loan);
    }
}
