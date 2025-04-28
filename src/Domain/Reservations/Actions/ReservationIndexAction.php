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
        $created_date = $search[2];

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
            ->when(!empty($bookIds), function ($query) use ($bookIds) {
                $query->whereIn('book_id', $bookIds);
            })
            ->when(!empty($userIds), function ($query) use ($userIds) {
                $query->whereIn('user_id', $userIds);
            })
            ->when($created_date !== "null", function ($query) use ($created_date) {
                $query->whereDate('created_at', '=', $created_date);
            })
            ->latest()
            ->paginate($perPage);

        return $reservations->through(fn($reservation) => ReservationResource::fromModel($reservation));
    }
}
