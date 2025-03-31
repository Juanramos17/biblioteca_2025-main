<?php

namespace Domain\Bookshelves\Model;

use Database\Factories\BookshelfFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bookshelf extends Model
{
    use HasUuids, HasFactory;
    protected $fillable = [
        'id',
        'enumeration',
        'n_shelves',
        'category',
        'n_books',
        'zone_id',
    ];

    protected static function newFactory()
    {
        return BookshelfFactory::new();
    }


    function zone()
    {
        return $this->belongsTo('Domain\Zones\Model\Zone');
    }

    function books()
    {
        return $this->hasMany('Domain\Books\Model\Book');
    }
}