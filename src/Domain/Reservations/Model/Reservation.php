<?php

namespace Domain\Reservations\Model;

use Database\Factories\ReservationFactory;
use Domain\Books\Model\Book;
use Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Reservation extends Model
{
    use HasUuids, HasFactory, SoftDeletes;
    protected $fillable = [
        'id',
        'book_id',
        'user_id',

    ];
    protected static function newFactory()
    {
        return ReservationFactory::new();
    }

    function book():BelongsTo
    {
        return $this->belongsTo(Book::class, 'book_id');
    }

    
    public function user():BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
