<?php

namespace App\Floor\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use App\Core\Controllers\Controller;
use Domain\Floors\Model\Floor;
use Domain\Genres\Model\Genre;
use Domain\Floors\Actions\FloorStoreAction;

class FloorsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $floors = Floor::withCount('zones')->orderBy('name')->get();

        $results = $floors->map(function ($floor) {
            return [
                'id' => $floor->id,
                'name' => $floor->name,
                'ubication' => $floor->ubication,
                'n_zones' => $floor->n_zones,
                'count' => $floor->zones_count,
                'zones' => $floor->zones,
            ];
        })->toArray();


        return Inertia::render('floors/Index', ["floors" => $results]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $genres = Genre::all();

        return Inertia::render('floors/Create', ["genres" => $genres]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, FloorStoreAction $action)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'int', 'min:1', 'unique:floors'],
            'ubication' => ['required', 'string', 'max:255'],
            'n_zones' => ['required', 'int', 'min:1'],
        ]);

        if ($validator->fails()) {

            return back()->withErrors($validator);
        }

        $action($validator->validated());

        return redirect()->route('floors.index')
            ->with('success', __('messages.floors.created'));
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
    public function edit(Request $request, Floor $floor)
    {
        return Inertia::render('floors/Edit', [
            'floor' => $floor,
            'page' => $request->query('page'),
            'perPage' => $request->query('perPage'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
