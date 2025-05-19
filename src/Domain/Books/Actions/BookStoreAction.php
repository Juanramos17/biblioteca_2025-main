<?php

namespace Domain\Books\Actions;

use Domain\Books\Model\Book;
use Domain\Books\Data\Resources\BookResource;
use Domain\Genres\Model\Genre;
use Symfony\Component\HttpFoundation\FileBag;

class BookStoreAction
{
    public function __invoke(array $data, FileBag $images): BookResource
    {
        $book = Book::create([
            'title'        => $data['title'],
            'author'       => $data['author'],
            'publisher'    => $data['publisher'],
            'ISBN'         => $data['ISBN'],
            'genre'        => $data['genre'],
            'bookshelf_id' => $data['bookshelf_id'],
        ]);

        if ($images->count() > 0) {
            foreach ($images as $file) {
                $book->addMedia($file)->toMediaCollection('images', 'images');
            }
        } else {
            $otherBookWithImage = Book::where('ISBN', $data['ISBN'])
                ->where('id', '!=', $book->id)
                ->get()
                ->filter(fn($b) => $b->getFirstMedia('images'))
                ->first();

            if ($otherBookWithImage) {
                $media = $otherBookWithImage->getFirstMedia('images');
                if ($media) {
                    $book->addMedia($media->getPath())
                         ->preservingOriginal()
                         ->toMediaCollection('images', 'images');
                }
            }
        }
   
        $genreNames = explode(', ', $data['genre']);  

       
        $genreNames = array_map('trim', $genreNames);
  
        $genreIds = Genre::whereIn('name', $genreNames)
                                      ->pluck('id')
                                      ->toArray();

                                      
    
        $book->genres()->sync($genreIds);

    
        return BookResource::fromModel($book);
    }
}
