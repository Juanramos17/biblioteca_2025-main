<?php

namespace Domain\Zones\Actions;

use Domain\Bookshelves\Model\Bookshelf;

class BookshelfDestroyAction
{
    public function __invoke(Bookshelf $bookshelf): void
    {
        $bookshelf->delete();
    }
}
