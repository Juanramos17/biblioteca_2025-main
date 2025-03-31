<?php

namespace Domain\Zones\Actions;

use Domain\Zones\Data\Resources\ZoneResource;
use Domain\Zones\Model\Zone;
use Illuminate\Support\Facades\Hash;

class ZoneUpdateAction
{
    public function __invoke(Zone $zone, array $data): ZoneResource
    {
        $updateData = [
            'name' => $data['name'],
            'category' => $data['category'],
            'n_bookshelves' => $data['n_bookshelves'],
            'floor_id' => $data['floor_id'],
        ];

        $zone->update($updateData);

        return ZoneResource::fromModel($zone->fresh());
    }
}
