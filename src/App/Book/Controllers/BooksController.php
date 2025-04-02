<?php

namespace App\Book\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use App\Core\Controllers\Controller;
use Domain\Books\Actions\BookStoreAction;
use Domain\Books\Model\Book;
use Domain\Floors\Model\Floor;
use Domain\Zones\Model\Zone;
use Domain\Genres\Model\Genre;

class BooksController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $books = Book::all();


        return Inertia::render('books/Index', ["books" => $books]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $genres = Genre::all();

        $floors = Floor::withCount('zones') 
            ->with(['zones' => function ($query) {
                $query->select('id', 'floor_id', 'category');
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
    public function store(Request $request, BookStoreAction $action)
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
            'shelves' => ['required', 'integer', 'min:0'], 
            'books' => ['required', 'integer', 'min:0'], 
            'zone_id' => ['required', 'exists:zones,id'], 
        ]);

        if ($validator->fails()) {

            return back()->withErrors($validator);
        }

        $action($validator->validated());

        return redirect()->route('zones.index')
            ->with('success', __('messages.zones.created'));
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
    public function edit(Request $request, Zone $zone)
    {
        $genres = Genre::all();
        $floors = Floor::all();

        return Inertia::render('zones/Edit', [
            'initialData' => $zone,
            'page' => $request->query('page'),
            'perPage' => $request->query('perPage'),
            "genres" => $genres, 
            "floors"=>$floors
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Zone $zone, ZoneUpdateAction $action)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'int', 'min:1'],
            'category' => ['required'],
            'n_bookshelves' => ['required', 'int', 'min:1'],
            'floor_id'=>['required'],
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        $action($zone, $validator->validated());

        $redirectUrl = route('zones.index');
        
        if ($request->has('page')) {
            $redirectUrl .= "?page=" . $request->query('page');
            if ($request->has('perPage')) {
                $redirectUrl .= "&per_page=" . $request->query('perPage');
            }
        }

        return redirect($redirectUrl)
            ->with('success', __('messages.users.updated'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
