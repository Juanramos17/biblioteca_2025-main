<?php

namespace Domain\Loans\Actions;

use Domain\Loans\Data\Resources\LoanResource;
use Domain\Loans\Model\Loan;

class LoanIndexAction
{
    public function __invoke(?array $search = null, int $perPage = 10)
    {
        $enumeration = $search[0];

        $loans = Loan::query()
            ->when($enumeration !== "null", function ($query) use ($enumeration) {
                $query->where('enumeration', 'like', '%' . $enumeration . '%');
            })
            
            ->latest()
            ->paginate($perPage);

        return $loans->through(fn($loan) => LoanResource::fromModel($loan));
    }
}
