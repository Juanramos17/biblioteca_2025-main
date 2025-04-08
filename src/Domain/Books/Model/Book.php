<?php

namespace Domain\Books\Model;

use Database\Factories\BookFactory;
use Domain\Genres\Model\Genre;
use Domain\Loans\Model\Loan;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Book extends Model implements HasMedia
{

    use HasUuids, HasFactory;
    use InteractsWithMedia;
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

    public function loans()
    {
        return $this->hasMany(Loan::class);
    }
}

