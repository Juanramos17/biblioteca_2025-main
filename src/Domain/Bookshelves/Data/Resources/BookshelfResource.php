<?php

namespace Domain\Bookshelves\Data\Resources;

use Domain\Bookshelves\Model\Bookshelf;
use Domain\Floors\Model\Floor;
use Domain\Zones\Model\Zone;
use Spatie\LaravelData\Data;

class BookshelfResource extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $zone_name,
        public readonly string $floor_name,
        public readonly int $enumeration,
        public readonly string $category,
        public readonly int $n_books,
        public readonly int $count,
        public readonly string $created_at,
        public readonly string $updated_at,
    ) {
    }

    public static function fromModel(Bookshelf $bookshelf): self
    {

        return new self(
            id: $bookshelf->id,
            enumeration: $bookshelf->enumeration,
            zone_name:$bookshelf->zone->name,
            floor_name: $bookshelf->zone->floor->name,
            category: $bookshelf->category,
            n_books: $bookshelf->n_books,
            count: $bookshelf->books()->count(),
            created_at: $bookshelf->created_at->format('Y-m-d H:i:s'),
            updated_at: $bookshelf->updated_at->format('Y-m-d H:i:s'),
        );
    }
}
