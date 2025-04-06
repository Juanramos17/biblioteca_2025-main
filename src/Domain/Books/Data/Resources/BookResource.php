<?php

namespace Domain\Books\Data\Resources;

use Domain\Books\Model\Book;
use Domain\Bookshelves\Model\Bookshelf;
use Domain\Floors\Model\Floor;
use Domain\Zones\Model\Zone;
use Spatie\LaravelData\Data;

class BookResource extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly int $ISBN,
        public readonly string $title,
        public readonly string $genre,
        public readonly string $publisher,
        public readonly string $author,
        public readonly string $bookshelf_name,
        public readonly string $zone_name,
        public readonly string $floor_name,
        public readonly string $created_at,
        public readonly string $updated_at,
    ) {
    }

    public static function fromModel(Book $book): self
    {

        return new self(
            id: $book->id,
            title: $book->title,
            bookshelf_name:$book->bookshelf->enumeration,
            zone_name:$book->bookshelf->zone->name,
            floor_name:$book->bookshelf->zone->floor->name,
            genre: $book->genre,
            publisher: $book->publisher,
            author: $book->author,
            ISBN: $book->ISBN,
            created_at: $book->created_at->format('Y-m-d H:i:s'),
            updated_at: $book->updated_at->format('Y-m-d H:i:s'),
        );
    }
}
