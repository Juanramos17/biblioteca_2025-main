<?php

namespace Domain\Loans\Actions;

use Domain\Loans\Model\Loan;

class LoanDestroyAction
{
    public function __invoke(Loan $loan): void
    {
        $loan->delete();
    }
}
