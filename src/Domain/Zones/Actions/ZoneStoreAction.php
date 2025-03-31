<?php

namespace Domain\Zones\Actions;

use Domain\Zones\Data\Resources\ZoneResource;
use Domain\Zones\Model\Zone;

class ZoneStoreAction
{
    public function __invoke(array $data): ZoneResource
    {
        $zone = Zone::create([
            'name' => $data['name'],
            'category' => $data['category'],
            'n_bookshelves' => $data['n_bookshelves'],
            'floor_id' => $data['floor_id'],
        ]);

        
        return ZoneResource::fromModel($zone);
    }
}
