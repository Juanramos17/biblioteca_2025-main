<?php

namespace Domain\Genres\Model;

use Domain\Books\Model\Book;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Genre extends Model
{
    use HasUuids, HasFactory;
    protected $fillable = [
        'id',
        'name',
    ];

public function books()
{
    return $this->belongsToMany(Book::class);
}

}
