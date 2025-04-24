<?php

namespace Domain\Loans\Actions;

use App\Notifications\Confirmacion;
use App\Notifications\Email;
use Domain\Loans\Data\Resources\LoanResource;
use Domain\Loans\Model\Loan;
use Domain\Reservations\Actions\ReservationUpdateAction;
use Domain\Users\Models\User;

class LoanUpdateAction
{
    public function __invoke(Loan $loan, array $data): LoanResource
    {
        if($data['borrow']=="true"){
            $user = User::where('name', $data['name'])->first();
            $updateData = [
                'isLoaned' => false,
            ];
            $user->notify(new Email);

            if($loan->book->reservations()->first()!== null){
                $oldestReservationUserId = $loan->book->reservations()
                ->orderBy('created_at', 'asc')
                ->value('user_id');

                $newUser = $user = User::where('id', $oldestReservationUserId)->first();
                $newUser->notify(new Confirmacion);
            }
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
