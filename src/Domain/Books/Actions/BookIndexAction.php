<?php

namespace Domain\Books\Actions;

use Domain\Books\Model\Book;
use Domain\Books\Data\Resources\BookResource;
use Domain\Bookshelves\Model\Bookshelf;

class BookIndexAction
{
    public function __invoke(?array $search = null, int $perPage = 10)
    {

        $title = $search[0];
        $bookshelf_enumeration = $search[1]; // Aquí pasas el enumeration
        $author = $search[2];
        $publisher = $search[3];
        $ISBN = $search[4];
        $category = $search[5];

        // Si se pasa un enumeration, obtenemos el ID del Bookshelf correspondiente
        $bookshelfId = null;
        if ($bookshelf_enumeration !== "null") {
            $bookshelf = Bookshelf::where('enumeration', $bookshelf_enumeration)->first();
            if ($bookshelf) {
                $bookshelfId = $bookshelf->id;
            }
        }

        $books = Book::query()
            ->when($title !== "null", function ($query) use ($title) {
                $query->where('title', 'like', '%' . $title . '%');
            })
            ->when($bookshelfId !== null, function ($query) use ($bookshelfId) {
                $query->where('bookshelf_id', '=', $bookshelfId); 
            })
            ->when($author !== "null", function ($query) use ($author) {
                $query->where('author', 'like', '%' . $author . '%');
            })
            ->when($publisher !== "null", function ($query) use ($publisher) {
                $query->where('publisher', 'like', '%' . $publisher . '%');
            })
            ->when($ISBN !== "null", function ($query) use ($ISBN) {
                $query->where('ISBN', 'like', $ISBN . '%') ;
            })
            ->when($category !== "null", function ($query) use ($category) {
                $query->where('genre', 'like', '%' . $category . '%');
            })
            ->latest()
            ->paginate($perPage);

        return $books->through(fn($book) => BookResource::fromModel($book));
    }
}
