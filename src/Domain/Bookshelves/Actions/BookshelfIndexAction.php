<?php

namespace Domain\Zones\Actions;

use Domain\Bookshelves\Model\Bookshelf;
use Domain\Zones\Data\Resources\BookshelfResource;

class BookshelfIndexAction
{
    public function __invoke(?string $search = null, int $perPage = 10)
    {
        $bookshelves = Bookshelf::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate($perPage);

        return $bookshelves->through(fn ($bookshelf) => BookshelfResource::fromModel($bookshelf));
    }
}
