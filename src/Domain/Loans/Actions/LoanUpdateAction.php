<?php

namespace Domain\Loans\Actions;

use Domain\Loans\Data\Resources\LoanResource;
use Domain\Loans\Model\Loan;
use Domain\Users\Models\User;

class LoanUpdateAction
{
    public function __invoke(Loan $loan, array $data): LoanResource
    {
        
        if($data['borrow']=="true"){
            $updateData = [
                'isLoaned' => false,
            ];
        }else{
            $user = User::where('email', $data['email'])->first()->id;
            $updateData = [
                'book_id' => $data['id'],
                'user_id' => $user,
                'due_date' => $data['date'],
            ];
        }


        $loan->update($updateData);

        return LoanResource::fromModel($loan->fresh());
    }
}
