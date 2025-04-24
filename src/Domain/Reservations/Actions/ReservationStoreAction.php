<?php

namespace Domain\Reservations\Actions;

use Domain\Reservations\Data\Resources\ReservationResource;
use Domain\Reservations\Model\Reservation;
use Domain\Users\Models\User;

class ReservationStoreAction
{
    public function __invoke(array $data): ReservationResource
    {
        $user = User::where('email', $data['email'])->first()->id;

        $reservation = Reservation::create([
            'book_id' => $data['id'],
            'user_id' => $user,
        ]);

        return ReservationResource::fromModel($reservation);

    }
}
