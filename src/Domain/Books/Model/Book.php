<?php

namespace Domain\Books\Model;

use Database\Factories\BookFactory;
use Domain\Genres\Model\Genre;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{

    use HasUuids, HasFactory;
    protected $fillable = [
        'id',
        'ISBN',
        'title',
        'publisher',
        'author',
        'genre',
        'bookshelf_id',
    ];
    protected static function newFactory()
    {
        return BookFactory::new();
    }

    function bookshelf()
    {
        return $this->belongsTo('Domain\Bookshelves\Model\Bookshelf');
    }

    
    public function genres()
{
    return $this->belongsToMany(Genre::class);
}
}

