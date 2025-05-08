<?php

namespace App\Graph;

use Domain\Graph\Actions\GraphBookAction;
use Domain\Graph\Actions\GraphUserAction;
use Inertia\Inertia;
use App\Core\Controllers\Controller;
use Domain\Books\Model\Book;
use Domain\Graph\Actions\GraphZoneAction;
use Domain\Users\Models\User;
use Domain\Zones\Model\Zone;
use Illuminate\Support\Facades\DB;

class GraphController extends Controller
{
    public function index(GraphBookAction $graphBookAction, GraphUserAction $graphUserAction, GraphZoneAction $graphZoneAction)
    {
        $topBooks = $graphBookAction();
        $topUsers = $graphUserAction();
        $topZones = $graphZoneAction();

        return Inertia::render('graphs/Index', [
            'topBooks' => $topBooks,
            'topUsers' => $topUsers,
            'topZones' => $topZones,
        ]);
    }
   
}
