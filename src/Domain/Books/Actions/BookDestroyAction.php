<?php

namespace Domain\Books\Actions;

use Domain\Books\Model\Book;

class BookDestroyAction
{
    public function __invoke(Book $book): void
    {
        $book->delete();
    }
}
