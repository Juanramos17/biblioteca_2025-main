<?php

namespace App\Zone\Controllers\Api;

use App\Core\Controllers\Controller;
use Domain\Zones\Actions\ZoneDestroyAction;
use Domain\Zones\Actions\ZoneIndexAction;
use Domain\Zones\Actions\ZoneStoreAction;
use Domain\Zones\Actions\ZoneUpdateAction;
use Domain\Zones\Model\Zone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ZoneApiController extends Controller
{
    public function index(Request $request, ZoneIndexAction $action)
    {
        return response()->json($action($request->search, $request->integer('per_page', 10)));
    }


    public function show(Zone $zone)
    {
        return response()->json(['zone' => $zone]);
    }

    public function store(Request $request, ZoneStoreAction $action)
    {
    }

    public function update()
    {
    }

    public function destroy(Zone $zone, ZoneDestroyAction $action)
    {
        $action($zone);

        return response()->json([
            'message' => __('messages.zones.deleted')
        ]);
    }
}
