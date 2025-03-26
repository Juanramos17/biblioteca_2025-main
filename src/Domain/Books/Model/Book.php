<?php

namespace Domain\Books\Model;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $fillable = [
        'id',
        'ISBN',
        'title',
        'publisher',
        'author',
        'genre',
        'bookshelve_id',
    ];

    function bookshelve()
    {
        return $this->belongsTo('Domain\Bookshelves\Model\Bookshelve');
    }
}

