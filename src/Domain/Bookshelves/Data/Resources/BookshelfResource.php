<?php

namespace Domain\Zones\Data\Resources;

use Domain\Bookshelves\Model\Bookshelf;
use Domain\Floors\Model\Floor;
use Domain\Zones\Model\Zone;
use Spatie\LaravelData\Data;

class BookshelfResource extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $zone_name,
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
        $zone = Zone::find($bookshelf->zone_id);  // Suponiendo que floor_name es un ID
        $zoneName = $zone ? $zone->name : '';

        return new self(
            id: $bookshelf->id,
            enumeration: $bookshelf->enumeration,
            zone_name:$zoneName,
            category: $bookshelf->category,
            n_books: $bookshelf->n_books,
            count: $bookshelf->books()->count(),
            created_at: $zone->created_at->format('Y-m-d H:i:s'),
            updated_at: $zone->updated_at->format('Y-m-d H:i:s'),
        );
    }
}
