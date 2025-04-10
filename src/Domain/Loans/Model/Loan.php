<?php

namespace Domain\Loans\Model;

use Database\Factories\LoanFactory;
use Domain\Books\Model\Book;
use Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Loan extends Model
{
    use HasUuids, HasFactory;
    protected $fillable = [
        'id',
        'book_id',
        'user_id',
        'loan_date',
        'due_date',
        'isLoaned',
        'isOverdue',

    ];
    protected static function newFactory()
    {
        return LoanFactory::new();
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
