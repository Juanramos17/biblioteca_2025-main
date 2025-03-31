<?php

namespace Domain\Zones\Actions;

use Domain\Bookshelves\Model\Bookshelf;
use Domain\Zones\Data\Resources\BookshelfResource;

class BookshelfStoreAction
{
    public function __invoke(array $data): BookshelfResource
    {
        $bookshelf = Bookshelf::create([
            'name' => $data['name'],
            'category' => $data['category'],
            'n_bookshelves' => $data['n_bookshelves'],
            'floor_id' => $data['floor_id'],
        ]);

        
        return BookshelfResource::fromModel($bookshelf);
    }
}
