<?php

namespace App\Loan\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use App\Core\Controllers\Controller;
use Domain\Bookshelves\Actions\BookshelfStoreAction;
use Domain\Bookshelves\Actions\BookshelfUpdateAction;
use Domain\Bookshelves\Model\Bookshelf;
use Domain\Floors\Model\Floor;
use Domain\Zones\Model\Zone;
use Domain\Genres\Model\Genre;
use Domain\Loans\Model\Loan;

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
        $genres = Genre::all();

        $floors = Floor::withCount('zones') 
            ->with(['zones' => function ($query) {
                $query->select('id', 'floor_id', 'category','name');
            }])
            ->orderBy('name')
            ->get();

        $zones = Zone::withCount('bookshelves') 
            ->with([
                'bookshelves' => function ($query) {
                    $query->select('id', 'zone_id', 'category'); 
                },
                'floor' => function ($query) { 
                    $query->select('id', 'name');
        }
    ])
    ->orderBy('category')
    ->get();

        return Inertia::render('bookshelves/Create', [
            "genres" => $genres,
            "zones" => $zones,
            "floors" => $floors
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, BookshelfStoreAction $action)
    {
        $validator = Validator::make($request->all(), [
            'enumeration' => [
                'required',
                'integer',
                'min:1',
                Rule::unique('bookshelves')->where(function ($query) use ($request) {
                    return $query->where('zone_id', $request->zone_id);
                })
            ],
            'category' => ['required', 'string', 'max:255'], 
            'n_books' => ['required', 'integer', 'min:0'], 
            'zone_id' => ['required', 'exists:zones,id'], 
        ]);

        if ($validator->fails()) {

            return back()->withErrors($validator);
        }

        $action($validator->validated());

        return redirect()->route('zones.index')
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
    public function edit(Request $request, Bookshelf $bookshelf)
{
    $genres = Genre::all();

    $currentZoneId = $bookshelf->zone_id; 

    $floors = Floor::withCount(['zones' => function ($query) use ($currentZoneId) {
            $query->where('id', '!=', $currentZoneId); 
        }])
        ->with(['zones' => function ($query) use ($currentZoneId) {
            $query->select('id', 'floor_id', 'category')
                  ->where('id', '!=', $currentZoneId); 
        }])
        ->orderBy('name')
        ->get();

    $zones = Zone::withCount(['bookshelves' => function ($query) use ($currentZoneId) {
            $query->where('zone_id', '!=', $currentZoneId); 
        }])
        ->with([
            'bookshelves' => function ($query) {
                $query->select('id', 'zone_id', 'category');
            },
            'floor' => function ($query) {
                $query->select('id', 'name');
            }
        ])
        ->orderBy('category')
        ->get();

    return Inertia::render('bookshelves/Edit', [
        'initialData' => $bookshelf,
        'floor_id' => $bookshelf->zone->floor->id,
        'page' => $request->query('page'),
        'perPage' => $request->query('perPage'),
        "genres" => $genres,
        "floors" => $floors,
        "zones" => $zones,
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
