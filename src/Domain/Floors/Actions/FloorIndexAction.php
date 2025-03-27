<?php

namespace Domain\Floors\Actions;

use Domain\Floors\Data\Resources\FloorResource;
use Domain\Floors\Model\Floor;

class FloorIndexAction
{
    public function __invoke(?string $search = null, int $perPage = 10)
    {
        $floors = Floor::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('ubication', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate($perPage);

        return $floors->through(fn ($floor) => FloorResource::fromModel($floor));
    }
}
