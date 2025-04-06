<?php

namespace Domain\Floors\Actions;

use Domain\Floors\Data\Resources\FloorResource;
use Domain\Floors\Model\Floor;

class FloorIndexAction
{
    public function __invoke(?array $search = null, int $perPage = 10)
    {

        
        $name = $search[0];
        $capacity = $search[1];

        $floor = Floor::query()
            ->when($name !== "null", function ($query) use ($name) {

                $query->where('name', '=', $name);
            })
            ->when($capacity !== "null", function ($query) use ($capacity) {
                $query->where('n_zones', '=', $capacity);
            })
            ->latest()
            ->paginate($perPage);

        return $floor->through(fn($floor) => FloorResource::fromModel($floor));
    }
}
