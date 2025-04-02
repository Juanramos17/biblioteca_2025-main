<?php

namespace Domain\Books\Actions;

use Domain\Books\Model\Book;
use Domain\Books\Data\Resources\BookResource;

class BookStoreAction
{
    public function __invoke(array $data): BookResource
    {
        $book = Book::create([
            'enumeration' => $data['enumeration'],
            'category' => $data['category'],
            'n_books' => $data['books'],
            'n_shelves' => $data['shelves'],
            'zone_id' => $data['zone_id'],
        ]);

        
        return BookResource::fromModel($book);
    }
}
