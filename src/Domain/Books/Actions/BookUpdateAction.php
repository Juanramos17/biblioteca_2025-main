<?php

namespace Domain\Books\Actions;

use Domain\Books\Model\Book;
use Domain\Books\Data\Resources\BookResource;

class BookUpdateAction
{
    public function __invoke(Book $book, array $data): BookResource
    {
        $updateData = [
            'title' => $data['title'],
            'author' => $data['author'],
            'publisher' => $data['publisher'],
            'ISBN' => $data['ISBN'],
            'genre' => $data['genre'],
            'bookshelf_id' => $data['bookshelf_id'],
        ];
    
        $book->update($updateData);
    
        return BookResource::fromModel($book->fresh());
    }
}
