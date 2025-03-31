<?php

namespace Domain\Zones\Data\Resources;

use Domain\Zones\Model\Zone;
use Spatie\LaravelData\Data;

class ZoneResource extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly int $name,
        public readonly string $category,
        public readonly int $n_bookshelves,
        public readonly int $count,
        public readonly string $created_at,
        public readonly string $updated_at,
    ) {
    }

    public static function fromModel(Zone $zone): self
    {
        return new self(
            id: $zone->id,
            name: $zone->name,
            category: $zone->category,
            n_bookshelves: $zone->n_bookshelves,
            count: $zone->bookshelves()->count(),
            created_at: $zone->created_at->format('Y-m-d H:i:s'),
            updated_at: $zone->updated_at->format('Y-m-d H:i:s'),
        );
    }
}
