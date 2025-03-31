<?php

namespace Domain\Floors\Actions;

use Domain\Floors\Data\Resources\FloorResource;
use Domain\Floors\Model\Floor;
use Illuminate\Support\Facades\Hash;

class FloorUpdateAction
{
    public function __invoke(Floor $floor, array $data): FloorResource
    {
        $updateData = [
            'name' => $data['name'],
            'ubication' => $data['ubication'],
            'n_zones' => $data['n_zones'],
        ];

        $floor->update($updateData);

        return FloorResource::fromModel($floor->fresh());
    }
}
