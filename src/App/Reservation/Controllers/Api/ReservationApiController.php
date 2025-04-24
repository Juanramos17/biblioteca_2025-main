<?php

namespace App\Reservation\Controllers\Api;

use App\Core\Controllers\Controller;
use Domain\Loans\Actions\LoanDestroyAction;
use Domain\Loans\Actions\LoanIndexAction;
use Domain\Loans\Model\Loan;
use Domain\Reservations\Actions\ReservationDestroyAction;
use Domain\Reservations\Actions\ReservationIndexAction;
use Domain\Reservations\Model\Reservation;
use Illuminate\Http\Request;

class ReservationApiController extends Controller
{
    public function index(Request $request, ReservationIndexAction $action)
    {
        return response()->json($action($request->search, $request->integer('per_page', 10)));
    }


    // public function show(Book $book)
    // {
    // }

    // public function store(Request $request, BookStoreAction $book)
    // {
       
    // }

    // public function update(Request $request, Book $book, BookUpdateAction $action)
    // {
    // }

    public function destroy(Reservation $reservation, ReservationDestroyAction $action)
    {
        $action($reservation);

        return response()->json([
            'message' => __('ui.messages.reservation.deleted')
        ]);
    }
}
