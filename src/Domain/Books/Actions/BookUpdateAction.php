<?php

namespace Domain\Books\Actions;

use Domain\Books\Model\Book;
use Domain\Books\Data\Resources\BookResource;
use Symfony\Component\HttpFoundation\FileBag;

class BookUpdateAction
{
    public function __invoke(Book $book, array $data, FileBag $images): BookResource
    {
        $updateData = [
            'title' => $data['title'],
            'author' => $data['author'],
            'publisher' => $data['publisher'],
            'ISBN' => $data['ISBN'],
            'genre' => $data['genre'],
            'bookshelf_id' => $data['bookshelf_id'],
        ];

        $book->clearMediaCollection('images');
        foreach($images as $file){
            $book->addMedia($file)->toMediaCollection('images', 'images');
        };
    
        $book->update($updateData);
    
        return BookResource::fromModel($book->fresh());
    }
}
