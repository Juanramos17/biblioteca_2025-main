<?php

namespace App\Floor\Controllers\Api;

use App\Core\Controllers\Controller;
use Domain\Bookshelves\Model\Bookshelf;
use Domain\Floors\Actions\FloorDestroyAction;
use Domain\Floors\Actions\FloorIndexAction;
use Domain\Floors\Actions\FloorStoreAction;
use Domain\Floors\Actions\FloorUpdateAction;
use Domain\Floors\Model\Floor;
use Domain\Zones\Actions\BookshelfDestroyAction;
use Domain\Zones\Actions\BookshelfIndexAction;
use Domain\Zones\Actions\BookshelfStoreAction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class BookshelfApiController extends Controller
{
    public function index(Request $request, BookshelfIndexAction $action)
    {
        return response()->json($action($request->search, $request->integer('per_page', 10)));
    }


    public function show(Bookshelf $bookshelf)
    {
        return response()->json(['bookshelf' => $bookshelf]);
    }

    public function store(Request $request, BookshelfStoreAction $bookshelf)
    {
       
    }

    public function update(Request $request, Floor $floor, FloorUpdateAction $action)
    {
    }

    public function destroy(Bookshelf $bookshelf, BookshelfDestroyAction $action)
    {
        $action($bookshelf);

        return response()->json([
            'message' => __('messages.bookshelves.deleted')
        ]);
    }
}
