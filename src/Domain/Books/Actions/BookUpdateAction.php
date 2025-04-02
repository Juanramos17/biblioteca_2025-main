<?php

namespace Domain\Books\Actions;

use Domain\Books\Model\Book;
use Domain\Books\Data\Resources\BookResource;

class BookUpdateAction
{
    public function __invoke(Book $book, array $data): BookResource
    {
        $updateData = [
            'enumeration' => $data['enumeration'],
            'category' => $data['category'],
            'n_books' => $data['books'],
            'n_shelves' => $data['shelves'],
            'zone_id' => $data['zone_id'],
        ];

        $book->update($updateData);

        return BookResource::fromModel($book->fresh());
    }
}
