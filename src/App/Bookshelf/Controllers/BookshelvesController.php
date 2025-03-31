<?php

namespace App\Bookshelf\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use App\Core\Controllers\Controller;
use Domain\Bookshelves\Model\Bookshelf;
use Domain\Floors\Model\Floor;
use Domain\Zones\Model\Zone;
use Domain\Genres\Model\Genre;
use Domain\Zones\Actions\ZoneStoreAction;
use Domain\Zones\Actions\ZoneUpdateAction;

class BookshelvesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bookshelves = Bookshelf::withCount('books')->orderBy('title')->get();

        $results = $bookshelves->map(function ($bookshelf) {
            return [
                'id' => $bookshelf->id,
                'enumeration' => $bookshelf->enumeration,
                'category' => $bookshelf->category,
                'n_books' => $bookshelf->n_books,
                'count' => $bookshelf->books_count,
                'books' => $bookshelf->books,
            ];
        })->toArray();


        return Inertia::render('bookshelves/Index', ["bookshelves" => $results]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $genres = Genre::all();
        $floors = Floor::all();

        return Inertia::render('zones/Create', ["genres" => $genres, "floors"=>$floors]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, ZoneStoreAction $action)
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
