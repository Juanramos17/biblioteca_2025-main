<?php

namespace Domain\Bookshelves\Actions;

use Domain\Bookshelves\Model\Bookshelf;
use Domain\Bookshelves\Data\Resources\BookshelfResource;
use Domain\Zones\Model\Zone;

class BookshelfIndexAction
{
    public function __invoke(?array $search = null, int $perPage = 10)
    {
        $enumeration = $search[0];
        $zoneNumber = $search[1];
        $category = $search[2];
        $n_books = $search[3];

        $zoneUuid = null;
        if ($zoneNumber !== "null") {
            $zone = Zone::where('name', $zoneNumber)->first(); 
            if ($zone) {
                $zoneUuid = $zone->id;
            }
        }

        $bookshelves = Bookshelf::query()
            ->when($enumeration !== "null", function ($query) use ($enumeration) {
                $query->where('enumeration', 'like', '%' . $enumeration . '%');
            })
            ->when($zoneUuid !== null, function ($query) use ($zoneUuid) {
                $query->where('zone_id', '=', $zoneUuid);
            })
            ->when($category !== "null", function ($query) use ($category) {
                $query->where('category', 'like', '%' . $category . '%');
            })
            ->when($n_books !== "null", function ($query) use ($n_books) {
                $query->where('n_books', 'like', $n_books . '%') ;
            })
            ->latest()
            ->paginate($perPage);

        return $bookshelves->through(fn($shelf) => BookshelfResource::fromModel($shelf));
    }
}
