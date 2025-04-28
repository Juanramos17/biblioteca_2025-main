<?php

namespace Domain\Books\Actions;
namespace Domain\Books\Actions;

use Domain\Books\Model\Book;
use Domain\Books\Data\Resources\BookResource;
use Domain\Bookshelves\Model\Bookshelf;
use Domain\Floors\Model\Floor;
use Domain\Loans\Model\Loan;
use Domain\Zones\Model\Zone;

class BookIndexAction
{
    public function __invoke(?array $search = null, int $perPage = 10)
    {
        $title = $search[0];
        $bookshelf_enumeration = $search[1];
        $author = $search[2];
        $publisher = $search[3];
        $ISBN = $search[4];
        $category = $search[5];
        $floor_name = $search[6];
        $zone_name = $search[7];
        $status = $search[8];

        $bookshelfId = null;
        if ($bookshelf_enumeration !== "null") {
            $bookshelf = Bookshelf::where('enumeration', $bookshelf_enumeration)->first();
            if ($bookshelf) {
                $bookshelfId = $bookshelf->id;
            }
        }
        
        $floorId = null;
        if ($floor_name !== "null") {
            $floor = Floor::where('name', $floor_name)->first();
            if ($floor) {
                $floorId = $floor->id;
            }
        }
        
        $zoneId = null;
        if ($zone_name !== "null") {
            $zone = Zone::where('name', $zone_name)->first();
            if ($zone) {
                $zoneId = $zone->id;
            }
        }

        $books_availables = Loan::where('isLoaned', '=', true)->pluck('book_id');

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
                $query->where('ISBN', 'like', $ISBN . '%');
            })
            ->when($category !== "null", function ($query) use ($category) {
                $query->where('genre', 'like', '%' . $category . '%');
            })
            ->when($floorId !== null, function ($query) use ($floorId) {
                $query->whereHas('bookshelf.zone.floor', function ($query) use ($floorId) {
                    $query->where('id', '=', $floorId);
                });
            })
            ->when($zoneId !== null, function ($query) use ($zoneId) {
                $query->whereHas('bookshelf.zone', function ($query) use ($zoneId) {
                    $query->where('id', '=', $zoneId);
                });
            })
            ->when($status == 'false', function ($query) use ($books_availables) {
                    $query->whereNotIn('id', $books_availables);  
            })
            ->when($status == 'true', function ($query) use ($books_availables) {
                    $query->whereIn('id', $books_availables);  
            })
            
            ->latest()
            ->paginate($perPage);


        return $books->through(fn($book) => BookResource::fromModel($book));
    }
}
