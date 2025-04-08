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

        foreach($images as $file){
            $book->addMedia($file)->toMediaCollection('images', 'images');
        };
   
        $genreNames = explode(',', $data['genre']);  

       
        $genreNames = array_map('trim', $genreNames);
  
        $genreIds = Genre::whereIn('name', $genreNames)
                                      ->pluck('id')
                                      ->toArray();

                                      
    
        $book->genres()->sync($genreIds);
    
        return BookResource::fromModel($book);
    }
}
