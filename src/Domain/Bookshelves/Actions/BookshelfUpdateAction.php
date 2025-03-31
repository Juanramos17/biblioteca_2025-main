<?php

namespace Domain\Zones\Actions;

use Domain\Bookshelves\Model\Bookshelf;
use Domain\Zones\Data\Resources\BookshelfResource;

class BookshelfUpdateAction
{
    public function __invoke(Bookshelf $bookshelf, array $data): BookshelfResource
    {
        $updateData = [
            'name' => $data['name'],
            'category' => $data['category'],
            'n_bookshelves' => $data['n_bookshelves'],
            'floor_id' => $data['floor_id'],
        ];

        $bookshelf->update($updateData);

        return BookshelfResource::fromModel($bookshelf->fresh());
    }
}
