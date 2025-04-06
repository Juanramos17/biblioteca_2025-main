<?php

namespace Domain\Zones\Actions;

use Domain\Floors\Model\Floor;
use Domain\Zones\Data\Resources\ZoneResource;
use Domain\Zones\Model\Zone;

class ZoneIndexAction
{
    public function __invoke(?array $search = null, int $perPage = 10)
    {
        $name = $search[0];
        $category = $search[1];
        $n_bookshelves = $search[2];
        $floorNumber = $search[3];

        $floorUuid = null;
        if ($floorNumber !== "null") {
            $floor = Floor::where('name', $floorNumber)->first(); 
            if ($floor) {
                $floorUuid = $floor->id;
            }
        }

        $zone = Zone::query()
            ->when($name !== "null", function ($query) use ($name) {
                $query->where('name', '=', $name);
            })
            ->when($category !== "null", function ($query) use ($category) {
                $query->where('category', 'like', '%' . $category . '%');
            })
            ->when($n_bookshelves !== "null", function ($query) use ($n_bookshelves) {
                $query->where('n_bookshelves', '=', $n_bookshelves);
            })
            ->when($floorUuid !== null, function ($query) use ($floorUuid) {
                $query->where('floor_id', '=', $floorUuid);
            })
            ->latest()
            ->paginate($perPage);


        return $zone->through(fn($zone) => ZoneResource::fromModel($zone));
    }
}
