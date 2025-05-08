<?php

namespace App\Timeline;

use App\Core\Controllers\Controller;
use Carbon\Carbon;
use Domain\Loans\Model\Loan;
use Domain\Reservations\Model\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class TimelineController extends Controller
{
    public function index(): Response
    {
        $loans = Loan::where('user_id', Auth::id())->with('book')->get();

        $reservations = Reservation::where('user_id', Auth::id())->with('book')->withTrashed()->get();

        $combined = $loans->merge($reservations)
            ->sortByDesc('created_at')
            ->values();
            

        $loansArray = $combined->map(function ($loanOrReservation) {
            $dueDate = Carbon::parse($loanOrReservation->due_date)->startOfDay();
            $today = Carbon::today();

            if ($loanOrReservation instanceof Loan) {
                $status = $dueDate->lt($today) ? true : false;
                $type = 'loan';
            } else {
                $status = false;
                $type = 'reservation';
            }

            $book = $loanOrReservation->book;
            $image = $book->getFirstMediaUrl('images');

            $loanArray = $loanOrReservation->toArray();
            $loanArray['status'] = $status;
            $loanArray['image'] = $image;
            $loanArray['type'] = $type;

            return $loanArray;
        });

        return Inertia::render('timelines/Index', [
            'loans' => $loansArray,
        ]);
    }
}
