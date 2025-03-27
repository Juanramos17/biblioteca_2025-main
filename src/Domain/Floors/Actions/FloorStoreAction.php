<?php

namespace Domain\Floors\Actions;

use Domain\Floors\Data\Resources\FloorResource;
use Domain\Floors\Model\Floor;

class FloorStoreAction
{
    public function __invoke(array $data): FloorResource
    {
        $floor = Floor::create([
            'name' => $data['name'],
            'ubication' => $data['ubication'],
            'n_zones' => $data['n_zones'],
        ]);

        
        return FloorResource::fromModel($floor);
    }
}
