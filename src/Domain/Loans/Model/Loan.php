<?php

namespace Domain\Loans\Model;

use Database\Factories\LoanFactory;
use Domain\Books\Model\Book;
use Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

    function book()
    {
        return $this->belongsTo(Book::class);
    }

    
    public function user()
{
    return $this->belongsTo(User::class);
}
}
