<?php

namespace App\Zone\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use App\Core\Controllers\Controller;
use Domain\Floors\Model\Floor;
use Domain\Zones\Model\Zone;
use Domain\Genres\Model\Genre;
use Domain\Zones\Actions\ZoneStoreAction;
use Domain\Zones\Actions\ZoneUpdateAction;
use Illuminate\Support\Facades\Gate;

class ZonesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Gate::authorize('report.view');

        $zones = Zone::withCount('bookshelves')->orderBy('name')->get();

        $results = $zones->map(function ($zone) {
            return [
                'id' => $zone->id,
                'name' => $zone->name,
                'category' => $zone->category,
                'n_bookshelves' => $zone->n_bookshelves,
                'count' => $zone->bookshelves_count,
            ];
        })->toArray();


        return Inertia::render('zones/Index', ["zones" => $results]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('report.print');

        $genres = Genre::all();

        $floors = Floor::withCount('zones')
            ->with(['zones' => function ($query) {
                $query->select('id', 'floor_id', 'category');
            }])
            ->orderBy('name')
            ->get();


        $zones = Zone::all()->pluck('name');

        return Inertia::render('zones/Create', ["genres" => $genres, "floors" => $floors, "zones" => $zones]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, ZoneStoreAction $action)
    {
        Gate::authorize('report.print');

        $validator = Validator::make($request->all(), [
            'name' => [
                'required',
                'int',
                'min:1',
                Rule::unique('zones')->where(function ($query) use ($request) {
                    return $query->where('floor_id', $request->floor_id);
                }),
            ],
            'category' => ['required'],
            'n_bookshelves' => ['required', 'int', 'min:1'],
            'floor_id' => ['required'],
        ]);

        if ($validator->fails()) {

            return back()->withErrors($validator);
        }

        $action($validator->validated());

        return redirect()->route('zones.index')
            ->with('success', __('ui.messages.zones.created'));
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
        Gate::authorize('report.print');
        
        $genres = Genre::all();

        $categoryToExclude = $zone->category;

        $floors = Floor::withCount([
            'zones' => function ($query) use ($categoryToExclude, $zone) {
                $query->where('category', '!=', $categoryToExclude)
                    ->where('id', '!=', $zone->id);
            }
        ])
            ->with([
                'zones' => function ($query) use ($categoryToExclude, $zone) {
                    $query->select('id', 'floor_id', 'category')
                        ->where('category', '!=', $categoryToExclude);
                }
            ])
            ->orderBy('name')
            ->get();

        return Inertia::render('zones/Edit', [
            'initialData' => $zone,
            'page' => $request->query('page'),
            'perPage' => $request->query('perPage'),
            "genres" => $genres,
            "floors" => $floors
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Zone $zone, ZoneUpdateAction $action)
    {
        Gate::authorize('report.print');

        $validator = Validator::make($request->all(), [
            'name' => [
                'required',
                'int',
                'min:1',
                Rule::unique('zones')->where(function ($query) use ($request) {
                    return $query->where('floor_id', $request->floor_id);
                })->ignore($request->route('zone')),
            ],
            'category' => ['required'],
            'n_bookshelves' => ['required', 'int', 'min:1'],
            'floor_id' => ['required'],
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
            ->with('success', __('ui.messages.zones.updated'));
    }

    public function destroy(string $id)
    {
        Gate::authorize('report.print');
        //
    }
}
