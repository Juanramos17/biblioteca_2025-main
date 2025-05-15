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
use Domain\Floors\Actions\FloorUpdateAction;
use Illuminate\Support\Facades\Gate;

class FloorsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
         Gate::authorize('report.view');

        $floors = Floor::withCount('zones')->orderBy('name')->get();

        $results = $floors->map(function ($floor) {
            return [
                'id' => $floor->id,
                'name' => $floor->name,
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
        Gate::authorize('report.print');
        $floors = Floor::all()->pluck('name');

        return Inertia::render('floors/Create', ["floors" => $floors]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, FloorStoreAction $action)
    {
        Gate::authorize('report.print');
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'integer', 'min:1', 'unique:floors,name'],
            'n_zones' => ['required', 'integer', 'min:1'],
        ]);

        if ($validator->fails()) {

            return back()->withErrors($validator);
        }

        $action($validator->validated());

        return redirect()->route('floors.index')
            ->with('success', __('ui.messages.floors.created'));
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
        Gate::authorize('report.print');
        $floors = Floor::where('name', '!=', $floor->name)->pluck('name');

        return Inertia::render('floors/Edit', [
            'initialData' => $floor,
            'page' => $request->query('page'),
            'perPage' => $request->query('perPage'),
            'floors' => $floors,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Floor $floor, FloorUpdateAction $action)
    {
        Gate::authorize('report.print');
        $validator = Validator::make($request->all(), [
            'name' => [
                'required',
                'int',
                'min:1',
                Rule::unique('floors')->ignore($floor->id),  
            ],
            'n_zones' => ['required', 'int', 'min:1'],
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        $action($floor, $validator->validated());

        $redirectUrl = route('floors.index');
        
        if ($request->has('page')) {
            $redirectUrl .= "?page=" . $request->query('page');
            if ($request->has('perPage')) {
                $redirectUrl .= "&per_page=" . $request->query('perPage');
            }
        }

        return redirect($redirectUrl)
            ->with('success', __('ui.messages.floors.updated'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Gate::authorize('report.print');
        //
    }
}
