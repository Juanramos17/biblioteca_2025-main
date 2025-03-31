<?php

namespace Domain\Bookshelves\Model;

use Database\Factories\BookshelveFactory;
use Database\Factories\ZoneFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bookshelve extends Model
{
    use HasUuids, HasFactory;
    protected $fillable = [
        'id',
        'name',
        'enumeration',
        'category',
        'n_books',
        'zone_id',
    ];

    protected static function newFactory()
    {
        return BookshelveFactory::new();
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