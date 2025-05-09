<?php

namespace Domain\Bookshelves\Actions;

use Domain\Bookshelves\Model\Bookshelf;
use Domain\Bookshelves\Data\Resources\BookshelfResource;

class BookshelfUpdateAction
{
    public function __invoke(Bookshelf $bookshelf, array $data): BookshelfResource
    {
        $updateData = [
            'enumeration' => $data['enumeration'],
            'category' => $data['category'],
            'n_books' => $data['n_books'],
            'zone_id' => $data['zone_id'],
        ];

        $bookshelf->update($updateData);

        return BookshelfResource::fromModel($bookshelf->fresh());
    }
}
