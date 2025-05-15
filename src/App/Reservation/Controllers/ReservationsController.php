<?php

namespace App\Reservation\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use App\Core\Controllers\Controller;
use Domain\Loans\Actions\LoanStoreAction;
use Domain\Loans\Actions\LoanUpdateAction;
use Domain\Loans\Model\Loan;
use Domain\Reservations\Actions\ReservationStoreAction;
use Domain\Reservations\Actions\ReservationUpdateAction;
use Domain\Reservations\Model\Reservation;
use Domain\Users\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class ReservationsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Gate::authorize('report.view');

        $lang = Auth::user()->settings ? Auth::user()->settings->preferences['locale'] : 'en';
        $reservations = Reservation::all()->toArray();

        return Inertia::render('reservations/Index', ["reservations" => $reservations, 'lang' => $lang]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        Gate::authorize('report.print');

        return Inertia::render('reservations/Create', [
           
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, ReservationStoreAction $action)
    {
        Gate::authorize('report.print');

        $validator = Validator::make($request->all(), [
            'id' => ['required', 'string', 'exists:books,id'],
            'email' => ['required', 'email', 'max:255', 'exists:users,email'],
        ]);

        if ($validator->fails()) {

            return back()->withErrors($validator);
        }

        $action($validator->validated());

        return redirect()->route('reservations.index')
            ->with('success', __('ui.messages.reservations.created'));
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
//     public function edit(Request $request, Reservation $reservation)
// {
//         $email = User::where('id', $reservation->user_id)->first()->email;
        
//         return Inertia::render('loans/Edit', [
//             'initialData' => [
//             'id' => $reservation->book_id, 
//             'loan_id' => $reservation->id,
//             'email' => $email,
//         ],
//         'page' => $request->query('page'),
//         'perPage' => $request->query('perPage'),
//         ]);
// }


    /**
     * Update the specified resource in storage.
     */
    // public function update(Request $request, Reservation $reservation, ReservationUpdateAction $action)
    // {

    //     $validator = Validator::make($request->all(), [
    //         'id' => ['required', 'integer', 'exists:users,id'],
    //         'email' => ['required', 'email', 'max:255', 'exists:users,email'],
    //     ]);

    //     if ($validator->fails()) {
    //         return back()->withErrors($validator);
    //     }

    //     $action($reservation, $validator->validated());

    //     $redirectUrl = route('reservations.index');
        
    //     if ($request->has('page')) {
    //         $redirectUrl .= "?page=" . $request->query('page');
    //         if ($request->has('perPage')) {
    //             $redirectUrl .= "&per_page=" . $request->query('perPage');
    //         }
    //     }

    //     return redirect($redirectUrl)
    //         ->with('success', __('ui.messages.loans.updated'));
    // }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Gate::authorize('report.print');
    }
}
