<?php

namespace App\Loan\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use App\Core\Controllers\Controller;
use Domain\Loans\Actions\LoanStoreAction;
use Domain\Loans\Actions\LoanUpdateAction;
use Domain\Loans\Model\Loan;
use Domain\Users\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class LoansController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Gate::authorize('report.view');

        $lang = Auth::user()->settings ? Auth::user()->settings->preferences['locale'] : 'en';
        $loans = Loan::all()->toArray();

        return Inertia::render('loans/Index', ["loans" => $loans, 'lang' => $lang]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('report.print');

        $lang = Auth::user()->settings ? Auth::user()->settings->preferences['locale'] : 'en';

        $emails = User::all()->toArray();

        return Inertia::render('loans/Create', [
            'lang' => $lang,
            'emails' => $emails,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, LoanStoreAction $action)
    {
        Gate::authorize('report.print');

        $validator = Validator::make($request->all(), [
            'id' => ['required', 'string', 'exists:books,id'],
            'email' => ['required', 'email', 'max:255', 'exists:users,email'],
            'date' => ['required', 'date'],
        ]);

        if ($validator->fails()) {

            return back()->withErrors($validator);
        }

        $action($validator->validated());

        return redirect()->route('loans.index')
            ->with('success', __('ui.messages.loans.created'));
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
    public function edit(Request $request, Loan $loan)
    {
        Gate::authorize('report.print');

        $emails = User::all()->toArray();

        $lang = Auth::user()->settings ? Auth::user()->settings->preferences['locale'] : 'en';
        $email = User::where('id', $loan->user_id)->first()->email;

        return Inertia::render('loans/Edit', [
            'initialData' => [
                'id' => $loan->book_id,
                'loan_id' => $loan->id,
                'email' => $email,
                'date' => $loan->due_date,
            ],
            'page' => $request->query('page'),
            'perPage' => $request->query('perPage'),
            'lang' => $lang,
            'emails' => $emails,
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Loan $loan, LoanUpdateAction $action)
    {
        Gate::authorize('report.print');

        $validator = Validator::make($request->all(), [
            'id' => ['string'],
            'email' => ['string', 'email', 'max:255', 'exists:books,email'],
            'date' => ['date', 'after_or_equal:today'],
            'name' => ['string', 'max:255'],
            'borrow' => ['string'],
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        $action($loan, $validator->validated());

        $redirectUrl = route('loans.index');

        if ($request->has('page')) {
            $redirectUrl .= "?page=" . $request->query('page');
            if ($request->has('perPage')) {
                $redirectUrl .= "&per_page=" . $request->query('perPage');
            }
        }

        return redirect($redirectUrl)
            ->with('success', __('ui.loans.updated'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Gate::authorize('report.print');
    }
}
