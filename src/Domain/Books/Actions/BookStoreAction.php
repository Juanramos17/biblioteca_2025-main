<?php

namespace Domain\Books\Actions;

use Domain\Books\Model\Book;
use Domain\Books\Data\Resources\BookResource;

class BookStoreAction
{
    public function __invoke(array $data): BookResource
    {
        $book = Book::create([
            'title'        => $data['title'],
            'author'       => $data['author'],
            'publisher'    => $data['publisher'],
            'ISBN'         => $data['ISBN'],
            'genre'        => $data['genre'],
            'bookshelf_id' => $data['bookshelf_id'],
        ]);

        
        return BookResource::fromModel($book);
    }
}
