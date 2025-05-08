<?php

namespace App\Graph;

use Inertia\Inertia;
use App\Core\Controllers\Controller;
use Domain\Books\Model\Book;
use Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

class GraphController extends Controller
{
    public function index()
    {
        // Libros más leídos (con datos adicionales)
        $topBooks = DB::table('books')
            ->join('loans', 'books.id', '=', 'loans.book_id')
            ->select(
                'books.id',
                'books.title',
                'books.ISBN',
                'books.author',
                'books.publisher',
                'books.genre',
                DB::raw('COUNT(loans.id) as total_loans')
            )
            ->groupBy('books.id', 'books.title', 'books.ISBN', 'books.author', 'books.publisher', 'books.genre')
            ->orderByDesc('total_loans')
            ->take(10)
            ->get()
            ->map(function ($item) {
                return [
                    'title'     => $item->title,
                    'isbn'      => $item->ISBN,
                    'author'    => $item->author,
                    'publisher' => $item->publisher,
                    'genres'    => $item->genre,
                    'value'     => (int) $item->total_loans,
                ];
            })
            ->toArray();

            $topUsers = DB::table('users')
            ->select(
                'users.id',
                'users.name',
                DB::raw('(SELECT COUNT(*) FROM loans WHERE loans.user_id = users.id) as loans_count'),
                DB::raw('(SELECT COUNT(*) FROM reservations WHERE reservations.user_id = users.id) as reservations_count'),
                DB::raw('((SELECT COUNT(*) FROM loans WHERE loans.user_id = users.id) + (SELECT COUNT(*) FROM reservations WHERE reservations.user_id = users.id)) as total_activity')
            )
            ->whereNull('users.deleted_at')
            ->orderByDesc('total_activity')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->name,
                    'value' => (int) $item->total_activity,
                    'loans' => (int) $item->loans_count,
                    'reservations' => (int) $item->reservations_count,
                ];
            })
            ->toArray();
            $topZones = DB::table('zones')
            ->join('bookshelves', 'bookshelves.zone_id', '=', 'zones.id')
            ->join('books', 'books.bookshelf_id', '=', 'bookshelves.id')
            ->leftJoin('loans', 'books.id', '=', 'loans.book_id')
            ->leftJoin('reservations', 'books.id', '=', 'reservations.book_id')
            ->select(
                'zones.name as zone_name',
                DB::raw('COUNT(DISTINCT loans.id) as loan_count'),
                DB::raw('COUNT(DISTINCT reservations.id) as reservation_count')
            )
            ->groupBy('zones.name')
            ->get()
            ->map(function ($item) {
                return [
                    'zone' => $item->zone_name,
                    'value' => (int) $item->loan_count + (int) $item->reservation_count,
                    'loans' => (int) $item->loan_count,
                    'reservations' => (int) $item->reservation_count,
                ];
            })
            ->sortByDesc('value')
            ->take(10)
            ->values()
            ->toArray();

        return Inertia::render('graphs/Index', [
            'topBooks' => $topBooks,
            'topUsers' => $topUsers,
            'topZones' => $topZones,
        ]);
    }
}
