<?php

namespace Domain\Zones\Actions;

use Domain\Zones\Data\Resources\ZoneResource;
use Domain\Zones\Model\Zone;

class ZoneIndexAction
{
    public function __invoke(?string $search = null, int $perPage = 10)
    {
        $zones = Zone::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate($perPage);

        return $zones->through(fn ($zone) => ZoneResource::fromModel($zone));
    }
}
