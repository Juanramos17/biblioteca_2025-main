<?php

namespace App\Loan\Controllers\Api;

use App\Core\Controllers\Controller;
use Domain\Loans\Actions\LoanDestroyAction;
use Domain\Loans\Actions\LoanIndexAction;
use Domain\Loans\Model\Loan;
use Illuminate\Http\Request;

class LoanApiController extends Controller
{
    public function index(Request $request, LoanIndexAction $action)
    {
        return response()->json($action($request->search, $request->integer('per_page', 10)));
    }


    // public function show(Book $book)
    // {
    // }

    // public function store(Request $request, BookStoreAction $book)
    // {
       
    // }

    // public function update(Request $request, Book $book, BookUpdateAction $action)
    // {
    // }

    public function destroy(Loan $loan, LoanDestroyAction $action)
    {
        $action($loan);

        return response()->json([
            'message' => __('ui.messages.loan.deleted')
        ]);
    }
}
