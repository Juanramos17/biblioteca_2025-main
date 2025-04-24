<?php

namespace Domain\Reservations\Actions;

use Domain\Books\Model\Book;
use Domain\Reservations\Data\Resources\ReservationResource;
use Domain\Reservations\Model\Reservation;
use Domain\Users\Models\User;

class ReservationIndexAction
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
        
        $reservations = Reservation::query()
            ->latest()
            ->paginate($perPage);

        return $reservations->through(fn($reservation) => ReservationResource::fromModel($reservation));
    }
}
