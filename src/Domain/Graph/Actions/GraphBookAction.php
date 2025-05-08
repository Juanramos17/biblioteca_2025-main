<?php

namespace Domain\Graph\Actions;

use Domain\Books\Model\Book;

class GraphBookAction
{
    public function __invoke()
    {
        $topBooks = Book::withCount('loans')->get()
            ->groupBy('ISBN')
            ->map(function ($books) {
                $total = $books->sum('loans_count');
                $book = $books->first();
                $book->loans_count = $total;
                return $book;
            })
            ->sortByDesc('loans_count')
            ->take(10)
            ->values()
            ->map(function ($book) {
                return [
                    'title' => $book->title,
                    'isbn' => $book->ISBN,
                    'author' => $book->author,
                    'publisher' => $book->publisher,
                    'genres' => $book->genre,
                    'value' => (int) $book->loans_count,
                ];
            })
            ->toArray();

            return $topBooks;
    }
}
