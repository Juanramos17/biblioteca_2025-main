<?php

namespace Domain\Bookshelves\Model;

use Illuminate\Database\Eloquent\Model;

class Bookshelve extends Model
{
    protected $fillable = [
        'id',
        'name',
        'enumeration',
        'category',
        'n_books',
        'zone_id',
    ];

    function zone()
    {
        return $this->belongsTo('Domain\Zones\Model\Zone');
    }

    function books()
    {
        return $this->hasMany('Domain\Books\Model\Book');
    }
}