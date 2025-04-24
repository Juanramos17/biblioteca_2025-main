<?php

namespace Domain\Reservations\Data\Resources;

use Domain\Reservations\Model\Reservation;
use Spatie\LaravelData\Data;

use function Termwind\parse;

class ReservationResource extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $book_id,
        public readonly string $user_id,
        public readonly string $created_at,
        public readonly string $updated_at,
    ) {
    }

    public static function fromModel(Reservation $reservation): self
    {
        
        return new self(
            id: $reservation->id,
            book_id: $reservation->book->title,
            user_id: $reservation->user->name,
            created_at: $reservation->created_at->format('Y-m-d H:i:s'),
            updated_at: $reservation->updated_at->format('Y-m-d H:i:s'),
        );
    }
}
