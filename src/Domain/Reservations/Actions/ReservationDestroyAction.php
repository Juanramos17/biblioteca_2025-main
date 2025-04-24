<?php

namespace Domain\Reservations\Actions;

use Domain\Loans\Model\Loan;
use Domain\Reservations\Model\Reservation;

class ReservationDestroyAction
{
    public function __invoke(Reservation $reservation): void
    {
        $reservation->delete();
    }
}
