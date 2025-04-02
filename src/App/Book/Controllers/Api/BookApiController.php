<?php

namespace App\Book\Controllers\Api;

use App\Core\Controllers\Controller;
use Domain\Books\Model\Book;
use Domain\Books\Actions\BookDestroyAction;
use Domain\Books\Actions\BookIndexAction;
use Domain\Books\Actions\BookStoreAction;
use Illuminate\Http\Request;

class BookApiController extends Controller
{
    public function index(Request $request, BookIndexAction $action)
    {
        return response()->json($action($request->search, $request->integer('per_page', 10)));
    }


    public function show(Book $book)
    {
    }

    public function store(Request $request, BookStoreAction $book)
    {
       
    }

    public function update(Request $request, Book $book, BookUpdateAction $action)
    {
    }

    public function destroy(Book $book, BookDestroyAction $action)
    {
        $action($book);

        return response()->json([
            'message' => __('messages.bookshelves.deleted')
        ]);
    }
}
