<?php

namespace App\Book\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use App\Core\Controllers\Controller;
use Domain\Books\Actions\BookStoreAction;
use Domain\Books\Actions\BookUpdateAction;
use Domain\Books\Model\Book;
use Domain\Bookshelves\Model\Bookshelf;
use Domain\Floors\Model\Floor;
use Domain\Zones\Model\Zone;
use Domain\Genres\Model\Genre;
use Domain\Zones\Actions\ZoneUpdateAction;
use Illuminate\Support\Facades\Gate;

use function PHPSTORM_META\map;

class BooksController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Gate::authorize('product.view');
        $books = Book::all();


        return Inertia::render('books/Index', ["books" => $books]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('product.create');
        $genres = Genre::all();

        $floors = Floor::withCount('zones')
            ->with(['zones' => function ($query) {
                $query->select('id', 'floor_id', 'category', 'name');
            }])
            ->orderBy('name')
            ->get();

        $zones = Zone::withCount('bookshelves')
            ->with([
                'bookshelves' => function ($query) {
                    $query->select('id', 'zone_id', 'category', 'enumeration');
                },
                'floor' => function ($query) {
                    $query->select('id', 'name');
                }
            ])
            ->orderBy('category')
            ->get();

        $books = Book::all()->map(function ($book) {
            $book['path'] = $book->getFirstMediaUrl('images');
            return $book;
        })->toArray();


        return Inertia::render('books/Create', [
            "genres" => $genres,
            "zones" => $zones,
            "floors" => $floors,
            'books' => $books,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, BookStoreAction $action)
    {
        Gate::authorize('product.create');

        $validator = Validator::make($request->all(), [
            'title' => ['required', 'string', 'max:255'],
            'author' => ['required', 'string', 'max:255'],
            'publisher' => ['required', 'string', 'max:255'],
            'ISBN' => ['required','string','max:20'],
            'genre' => ['required', 'string', 'max:255'],
            'bookshelf_id' => ['required', 'exists:bookshelves,id'],
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        $action($validator->validated(), $request->files);

        return redirect()->route('books.index')
            ->with('success', __('ui.messages.books.created'));
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
    public function edit(Request $request, Book $book)
    {
        Gate::authorize('product.edit');

        $genres = Genre::all();

        $floors = Floor::withCount('zones')
            ->with(['zones' => function ($query) {
                $query->select('id', 'floor_id', 'category', 'name');
            }])
            ->orderBy('name')
            ->get();

        $zones = Zone::withCount('bookshelves')
            ->with([
                'bookshelves' => function ($query) {
                    $query->select('id', 'zone_id', 'category', 'enumeration');
                },
                'floor' => function ($query) {
                    $query->select('id', 'name');
                }
            ])
            ->orderBy('category')
            ->get();

        $image_path = $book->getFirstMediaUrl('images');



        return Inertia::render('books/Edit', [
            'initialData' => $book,
            'page' => $request->query('page'),
            'perPage' => $request->query('perPage'),
            "genres" => $genres,
            "floors" => $floors,
            "zones" => $zones,
            'floor_id' => $book->bookshelf->zone->floor->id,
            'zone_id' => $book->bookshelf->zone->id,
            'image_path' => $image_path,
            // 'image' => $image,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Book $book, BookUpdateAction $action)
    {
        Gate::authorize('product.edit');
        $validator = Validator::make($request->all(), [
            'title' => ['required', 'string', 'max:255'],
            'author' => ['required', 'string', 'max:255'],
            'publisher' => ['required', 'string', 'max:255'],
            'ISBN' => ['required','string','max:20'],
            'genre' => ['required', 'string', 'max:255'],
            'bookshelf_id' => ['required', 'exists:bookshelves,id'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

         $action($book, $validator->validated(), $request->files);

        $redirectUrl = route('books.index');

        if ($request->has('page')) {
            $redirectUrl .= "?page=" . $request->query('page');
            if ($request->has('perPage')) {
                $redirectUrl .= "&per_page=" . $request->query('perPage');
            }
        }

        return redirect($redirectUrl)
            ->with('success', __('ui.messages.books.updated'));
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Gate::authorize('product.delete');
    }
}
