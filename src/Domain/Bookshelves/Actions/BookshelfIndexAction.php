<?php

namespace Domain\Bookshelves\Actions;

use Domain\Bookshelves\Model\Bookshelf;
use Domain\Bookshelves\Data\Resources\BookshelfResource;
use Domain\Zones\Model\Zone;
use Domain\Floors\Model\Floor;

class BookshelfIndexAction
{
    public function __invoke(?array $search = null, int $perPage = 10)
    {
        $enumeration = $search[0];
        $zoneName = $search[1];
        $category = $search[2];
        $n_books = $search[3];
        $floorName = $search[4];

        $zoneId = null;
        if ($zoneName !== "null") {
            $zone = Zone::where('name', $zoneName)->first();
            if ($zone) {
                $zoneId = $zone->id;
            }
        }

        $floorId = null;
        if ($floorName !== "null") {
            $floor = Floor::where('name', $floorName)->first();
            if ($floor) {
                $floorId = $floor->id;
            }
        }

        $bookshelves = Bookshelf::query()
            ->when($enumeration !== "null", function ($query) use ($enumeration) {
                $query->where('enumeration', 'like', '%' . $enumeration . '%');
            })
            ->when($zoneId !== null, function ($query) use ($zoneId) {
                $query->where('zone_id', '=', $zoneId);
            })
            ->when($category !== "null", function ($query) use ($category) {
                $query->where('category', 'like', '%' . $category . '%');
            })
            ->when($n_books !== "null", function ($query) use ($n_books) {
                $query->where('n_books', '>=', (int) $n_books);
            })
            ->when($floorId !== null, function ($query) use ($floorId) {
                $query->whereHas('zone.floor', function ($query) use ($floorId) {
                    $query->where('id', '=', $floorId);
                });
            })
            ->latest()
            ->paginate($perPage);

        return $bookshelves->through(fn($shelf) => BookshelfResource::fromModel($shelf));
    }
}
