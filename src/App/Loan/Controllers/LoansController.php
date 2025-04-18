<?php

namespace App\Loan\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use App\Core\Controllers\Controller;
use Domain\Books\Model\Book;
use Domain\Bookshelves\Actions\BookshelfStoreAction;
use Domain\Bookshelves\Actions\BookshelfUpdateAction;
use Domain\Bookshelves\Model\Bookshelf;
use Domain\Floors\Model\Floor;
use Domain\Zones\Model\Zone;
use Domain\Genres\Model\Genre;
use Domain\Loans\Actions\LoanStoreAction;
use Domain\Loans\Model\Loan;
use Domain\Users\Models\User;

class LoansController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $loans = Loan::all()->toArray();

        return Inertia::render('loans/Index', ["loans" => $loans]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        return Inertia::render('loans/Create', [
           
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, LoanStoreAction $action)
    {
        $validator = Validator::make($request->all(), [
            'id' => ['required' ],
            'email' => ['required'], 
            'date' => ['required'], 
        ]);

        if ($validator->fails()) {

            return back()->withErrors($validator);
        }

        $action($validator->validated());

        return redirect()->route('loans.index')
            ->with('success', __('ui.messages.bookshelves.created'));
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
        $email = User::where('id', $loan->user_id)->first()->email;
        

        return Inertia::render('loans/Edit', [
            'initialData' => [
            'id' => $loan->book_id, 
            'email' => $email,
            'date' => $loan->due_date,
        ],
        'page' => $request->query('page'),
        'perPage' => $request->query('perPage'),
        ]);
}


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Bookshelf $bookshelf, BookshelfUpdateAction $action)
    {
        $validator = Validator::make($request->all(), [
            'enumeration' => [
                'required',
                'integer',
                'min:1',
                Rule::unique('bookshelves')
                    ->where(function ($query) use ($request) {
                        return $query->where('zone_id', $request->zone_id);
                    })
                    ->ignore($request->route('bookshelf')),  
            ],
            'category' => ['required', 'string', 'max:255'],
            'n_books' => ['required', 'integer', 'min:0'],
            'zone_id' => ['required', 'exists:zones,id'],
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        $action($bookshelf, $validator->validated());

        $redirectUrl = route('bookshelves.index');
        
        if ($request->has('page')) {
            $redirectUrl .= "?page=" . $request->query('page');
            if ($request->has('perPage')) {
                $redirectUrl .= "&per_page=" . $request->query('perPage');
            }
        }

        return redirect($redirectUrl)
            ->with('success', __('ui.messages.bookshelves.updated'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
