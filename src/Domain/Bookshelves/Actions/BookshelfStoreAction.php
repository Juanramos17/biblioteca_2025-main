<?php

namespace Domain\Bookshelves\Actions;

use Domain\Bookshelves\Model\Bookshelf;
use Domain\Bookshelves\Data\Resources\BookshelfResource;

class BookshelfStoreAction
{
    public function __invoke(array $data): BookshelfResource
    {
        $bookshelf = Bookshelf::create([
            'enumeration' => $data['enumeration'],
            'category' => $data['category'],
            'n_books' => $data['books'],
            'n_shelves' => $data['shelves'],
            'zone_id' => $data['zone_id'],
        ]);

        
        return BookshelfResource::fromModel($bookshelf);
    }
}
